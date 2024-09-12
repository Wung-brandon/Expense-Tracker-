from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, UserProfileSerializer, SignUpSerializer, EmailSerializer, ResendVerificationEmailSerializer, UserSerializer, ResetPasswordSerializer
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import User, Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from django.urls import reverse
from django.shortcuts import redirect
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import send_notification
from django.conf import settings
from rest_framework.parsers import FormParser, MultiPartParser

# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]
    
class SignUpView(GenericAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            try:
                # Generate verification token and link
                user_data = serializer.data
                user = User.objects.get(email=user_data["email"])
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = PasswordResetTokenGenerator().make_token(user)
                verification_link = request.build_absolute_uri(
                    reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
                )

                # Create the message as a string
                message = (
                    f"Hi {user.username},\n\n"
                    f"Please click the link below to activate your Account:\n"
                    f"{verification_link}\n\n"
                    f"If you did not make this request, you can ignore this email.\n\n"
                    f"Thanks,\n"
                    f"Your Team"
                )
                subject = "Verify your Account"

                # Send verification email
                send_notification(user, message, subject)

                return Response(
                    {"message": "Registration successful. Please check your email to verify your account."},
                    status=status.HTTP_201_CREATED
                )
             
            except Exception as e:
                return Response(
                    {"message": f"Registration failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        return Response(
                {"message": "Something went wrong."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class GetUserView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListCreateUserProfileView(ListCreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        return Response("Profile Created Successfully", status=status.HTTP_200_OK)
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by("id")
    
class RetrieveUpdateUserProfileView(RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    lookup_field = "id"
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    # def get_object(self):
    #     return self.request.user
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by("id")


    
    
    
    

class ForgotPasswordView(GenericAPIView):
    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Create token and send reset password email.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            encoded_pk = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
           
            # Construct the frontend reset URL
            reset_url = f"http://localhost:5173/reset-password/{encoded_pk}/{token}/"

            # Create the message as a string
            message = (
                f"Hi {user.username},\n\n"
                f"Please click the link below to reset your password:\n"
                f"{reset_url}\n\n"
                f"If you did not make this request, you can ignore this email.\n\n"
                f"Thanks,\n"
                f"Your Team"
            )
            
            subject = "Password Reset Request"
            
            send_notification(user, message, subject)
            
            return redirect(reset_url)
            
            # redirect_url = f"http://localhost:5173/reset-password"
            # return redirect(redirect_url)

            # return Response(
            #     {"message": "Password reset link has been sent to your email."},
            #     status=status.HTTP_200_OK,
            # )
        else:
            return Response(
                {"message": "User does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

class ResetPasswordView(GenericAPIView):
    """
    Verify and Reset Password Token View.
    """
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def patch(self, request, *args, **kwargs):
        """
        Verify token & uidb64 and then reset the password.
        """
        uidb64 = self.kwargs.get('uidb64')
        token = self.kwargs.get('token')
        
        print(uidb64, token)

        if not uidb64 or not token:
            return Response(
                {"message": "Missing uidb64 or token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Deserialize password data
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data['password']

        # Decode the uidb64 to get the user
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"message": "Invalid token or user ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify the token
        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response(
                {"message": "Invalid token or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Reset the password
        user.set_password(password)
        user.save()
        
        # Send a success email
        subject = "Password Reset Successful"
        message = f"Your password has been successfully reset."
        send_notification(user, message, subject)


        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK,
        )
      

class EmailVerificationView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and PasswordResetTokenGenerator().check_token(user, token):
            user.is_verified = True
            user.save()
            
            
            # Construct the redirect URL with a success message
            redirect_url = f"http://localhost:5173/login?account_verified=True"
            
             # Send confirmation email
            message = f"Hi {user.username},\n\nYour account has been activated successfully.\n\nThanks,\nYour Team"
            subject = "Account Activated"
            send_notification(user, message, subject)


            # Redirect the user to the frontend login page
            return redirect(redirect_url)

           
            # return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Activation link is invalid"}, status=status.HTTP_400_BAD_REQUEST)
        
class ResendVerificationEmailView(GenericAPIView):
    serializer_class = ResendVerificationEmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.get(email=email)

        # Generate new verification token and link
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"

        # Create the message as a string
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

        return Response({"message": "Verification email resent."}, status=status.HTTP_200_OK)
    
