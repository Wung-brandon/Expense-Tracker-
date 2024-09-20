from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import User, Profile
from .utils import send_notification

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["gender"] = user.gender
        token["is_verified"] = user.is_verified
        token["full_name"] = user.profile.full_name
        token["bio"] = user.profile.bio
        token["location"] = user.profile.location
        token["phone_number"] = user.profile.phone_number
        token["profile_img"] = str(user.profile.profile_img)
        return token
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_verified', 'email', 'gender'] 
        read_only_fields = ['id','is_verified']
        
class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username') 
    email = serializers.EmailField(source='user.email', required=False)
    gender = serializers.CharField(source='user.gender', required=False)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'full_name', 'bio', 'phone_number', 'gender', 'email', 'location', 'profile_img']  # Include all fields you want to expose
        # read_only_fields = ['id']
        

    def create(self, validated_data):
        # Create a new Profile instance linked to the authenticated user
        user = self.context['request'].user
        # Check if the profile already exists
        profile, created = Profile.objects.get_or_create(user=user, defaults=validated_data)
        
        if not created:
            # Update the existing profile with the new data
            for attr, value in validated_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return profile
    def update(self, instance, validated_data):
        # Handle user fields
        user_data = validated_data.pop('user', {})
        user = instance.user
        if 'email' in user_data:
            user.email = user_data['email']
        if 'gender' in user_data:
            user.gender = user_data['gender']
        user.save()

        # Handle profile fields
        return super().update(instance, validated_data)

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, min_length=6, required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "gender", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            gender=validated_data["gender"],
        )
        user.set_password(validated_data["password"])
        user.save()

        
        return user
     
     
class ResetPasswordSerializer(serializers.Serializer):
    """
    Reset Password Serializer.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        max_length=100
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length=6,
        max_length=100
    )

    def validate(self, data):
        """
        Validate the password and ensure it matches confirmation.
        """
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")

        return data

class EmailVerificationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        try:
            uid = urlsafe_base64_decode(attrs['uid']).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user ID.")

        if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid token.")
        
        return attrs

    def save(self):
        uid = self.validated_data['uid']
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        user.is_active = True
        user.save()

class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    # Store the user after validation
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.is_active:
                raise serializers.ValidationError("This account is already verified.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with this email exists.")
        
        self.user = user  # Store the user object for use in save()
        return value

    def save(self):
        # Use the validated email and user instance stored in validation
        user = self.user
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"

        # Send the verification email
        try:
            message = (
            f"Hi {user.username},\n\n"
            f"Please click the link below to verify your email:\n"
            f"{verification_link}\n\n"
            f"If you did not make this request, you can ignore this email.\n\n"
            f"Thanks,\n"
            f"Your Team"
        )
            subject = "Verify your Account"

            # Send verification email
            send_notification(user, message, subject)
        except Exception as e:
            raise serializers.ValidationError(f"Failed to send email: {str(e)}")

class EmailSerializer(serializers.Serializer):
    """
    Reset Password Email Request Serializer.
    """

    email = serializers.EmailField()

    class Meta:
        fields = ("email",)
        
class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.is_verified:
                raise serializers.ValidationError("This account is already verified.")
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value