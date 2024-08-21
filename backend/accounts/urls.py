from django.urls import path
from .views import SignUpView, MyTokenObtainPairView, GetUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("signup/", SignUpView.as_view(), name="signup"), 
    path("user/<int:id>/", GetUserView.as_view(), name="userId"),
    
]
