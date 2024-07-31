from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, User
from .models import CustomUser


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email']  # Add other fields as necessary
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'nickname', 'password1', 'password2')

class CustomAuthenticationForm(AuthenticationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')
