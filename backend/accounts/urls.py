from django.urls import path
from .views import SignUpView, MyTokenObtainPairView, GetUserView, ForgotPasswordView, EmailVerificationView, ResetPasswordView, ResendVerificationEmailView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("signup/", SignUpView.as_view(), name="signup"), 
    path("user/<int:id>/", GetUserView.as_view(), name="userId"),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend_verification_email'),
    path('reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),
    path('verify-email/<uidb64>/<token>/', EmailVerificationView.as_view(), name='verify-email'),
    
]
