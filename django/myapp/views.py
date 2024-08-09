from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.models import User
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm, ChangePasswordForm

# # Create your views here.

#define views, links them to html files
def user_logout(request):
    logout(request)
    return redirect(reverse('logout_done'))
def home(request):
    return render(request, 'home.html')
def pong(request):
    return render(request, 'pong.html')
def index(request):
    return render(request, 'index.html')
def view_404(request):
    return render(request, '404.html')
    # return HttpResponse("Hello, world. You're at the myapp index.")
def LoginView(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'login.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

@login_required
def profile(request):
    if request.method == 'POST':
        user_profile_form = UserProfileForm(request.POST, instance=request.user)
        change_password_form = ChangePasswordForm(user=request.user, data=request.POST)

        if user_profile_form.is_valid() and change_password_form.is_valid():
            user_profile_form.save()
            user = change_password_form.save()
            update_session_auth_hash(request, user)  # Important for keeping the user logged in after password change
            return redirect('profile')  # Redirect to a profile page or any other page after successful update
    else:
        user_profile_form = UserProfileForm(instance=request.user)
        change_password_form = ChangePasswordForm(user=request.user)

    return render(request, 'profile.html', {
        'user_profile_form': user_profile_form,
        'change_password_form': change_password_form,
    })


@login_required
def user_list(request):
    users = User.objects.all()
    return render(request, 'user_list.html', {'users': users})
