from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save



class UserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_field):
        if not username:
            raise ValueError("The user name must be given")
        if not email:
            raise ValueError("The user email must be given")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_field)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("superuser must have is_superuser=True")
        return self.create_user(username=username, email=email, password=password, **extra_fields)

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=250)
    bio = models.TextField()
    profile_img = models.ImageField(default="default.png", upload_to="user_images")
    
    def __str__(self):
        return self.full_name
    

def create_profile(sender, created, instance, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_profile(sender, instance, **kwargs):
    instance.profile.save()
    
post_save.connect(create_profile, sender=User)
post_save.connect(save_profile, sender=User)
        
    
    