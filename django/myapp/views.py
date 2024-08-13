from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.models import User
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm, ChangePasswordForm
##

def get_usernames(request):
    # Liste des noms d'utilisateur
    usernames = list(CustomUser.objects.values_list('nickname', flat=True))
    return JsonResponse({'usernames': usernames})

# # Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .models import CustomUser
import json

# @csrf_exempt  # Remove this decorator in production and handle CSRF properly
@require_POST
def update_winner(request):
    try:
        data = json.loads(request.body)
        winner_username = data.get('winner')
        loser_username = data.get('loser')

        if not winner_username or not loser_username:
            return JsonResponse({'status': 'error', 'message': 'Missing winner or loser username'}, status=400)

        try:
            winner = CustomUser.objects.get(username=winner_username)
            loser = CustomUser.objects.get(username=loser_username)
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)

        winner.wins += 1
        loser.losses += 1
        winner.save()
        loser.save()

        return JsonResponse({'status': 'success'})
    
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

#define views, links them to html files
def user_logout(request):
    logout(request)
    return redirect(reverse('logout_done'))
def home(request):
    return render(request, 'home.html')
def pong(request):
    return render(request, 'pong.html')
def pongA(request):
    return render(request, 'pong_ai.html')
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

        if 'update_profile' in request.POST:
            if user_profile_form.is_valid():
                # Only update if there is a change
                new_username = user_profile_form.cleaned_data.get('nickname')
                new_email = user_profile_form.cleaned_data.get('email')
                if (new_username and new_username != request.user.nickname) or (new_email and new_email != request.user.email):
                    user_profile_form.save()

        if 'change_password' in request.POST:
            if change_password_form.is_valid():
                user = change_password_form.save()
                update_session_auth_hash(request, user)  # Keep the user logged in after password change
                return redirect('profile')  # Redirect after successful change

    else:
        user_profile_form = UserProfileForm(instance=request.user)
        change_password_form = ChangePasswordForm(user=request.user)

    return render(request, 'profile.html', {
        'user_profile_form': user_profile_form,
        'change_password_form': change_password_form,
    })
    
@login_required
def user_list(request):
    users = CustomUser.objects.all()  # Fetch all users (adjust query as needed)
    logged_in_user = request.user  # Get the logged-in user
    return render(request, 'user_list.html', {
        'users': users,
        'logged_in_user': logged_in_user
    })