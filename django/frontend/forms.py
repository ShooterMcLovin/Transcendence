from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser
from django.contrib.auth.forms import PasswordChangeForm

     
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'nickname', 'password1', 'password2')

class CustomAuthenticationForm(AuthenticationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')

class ChangePasswordForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}))

class AvatarForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['avatar_url']  # Ensure this field exists in your User model

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['avatar_url'].widget.attrs.update({'class': 'form-control'})

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['nickname','username', 'avatar_url']  # Add other fields as necessary
class updateUserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['nickname', 'avatar_url']  # Add other fields as necessary
   