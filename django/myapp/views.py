from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm, ChangePasswordForm
from django.templatetags.static import static
from .forms import AvatarForm
##


def get_usernames(request):
    # Liste des noms d'utilisateur
    usernames = list(CustomUser.objects.values_list('nickname', flat=True))
    return JsonResponse({'usernames': usernames})
def get_username(request):
    # Get the currently logged-in user
    user = request.user

    # Return the username of the logged-in user
    return JsonResponse({'username': user.nickname})
# # Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .models import CustomUser
import json

# @csrf_exempt  # Remove this decorator in production and handle CSRF properly
def update_winner(request):
    try:
        data = json.loads(request.body)
        winner_username = data.get('winner')
        loser_username = data.get('loser')

        if not winner_username and not loser_username:
            return JsonResponse({'status': 'error', 'message': 'Missing winner or loser username'}, status=400)

        # Try to update the winner if not 'AI' or 'IA'
        if winner_username not in ['AI', 'IA']:
            try:
                winner = CustomUser.objects.get(nickname=winner_username)
                winner.wins += 1
                winner.save()
            except CustomUser.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'Winner not found: {winner_username}'}, status=404)

        # Try to update the loser if not 'AI' or 'IA'
        if loser_username not in ['AI', 'IA']:
            try:
                loser = CustomUser.objects.get(nickname=loser_username)
                loser.losses += 1
                loser.save()
            except CustomUser.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'Loser not found: {loser_username}'}, status=404)

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
def profile(request):
    return render(request, 'profile.html')

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
def update_profile(request):
    if request.method == 'POST':
        user_profile_form = UserProfileForm(request.POST, instance=request.user)
        avatar_form = AvatarForm(request.POST, instance=request.user)

        if 'save_changes' in request.POST:  # Check for the button name
            if user_profile_form.is_valid():
                user_profile_form.save()  # Save profile updates directly from the form
                return redirect('profile')  # Redirect to avoid form resubmission

        elif 'update_avatar' in request.POST:  # Handle avatar update
            if avatar_form.is_valid():
                request.user.avatar_url = avatar_form.cleaned_data.get('avatar_url')
                request.user.save()  # Save the avatar URL
                return redirect('profile')  # Redirect to avoid form resubmission

    else:
        user_profile_form = UserProfileForm(instance=request.user)
        avatar_form = AvatarForm(instance=request.user)

    return render(request, 'update_profile.html', {
        'user_profile_form': user_profile_form,
        'avatar_form': avatar_form,
    })

@login_required
def user_list(request):
    users = CustomUser.objects.all()  # Fetch all users (adjust query as needed)
    logged_in_user = request.user  # Get the logged-in user
    return render(request, 'user_list.html', {
        'users': users,
        'logged_in_user': logged_in_user
    })

@login_required
def update_avatar(request):
    if request.method == 'POST':
        avatar_url = request.POST.get('avatar_url')
        if avatar_url:
            user = request.user
            user.avatar_url = avatar_url
            user.save()
            messages.success(request, 'Avatar updated successfully!')
        else:
            messages.error(request, 'Invalid URL. Please try again.')
        return redirect('profile')  # Adjust to your URL pattern name
    
    return render(request, 'update_avatar.html')

@login_required
def update_password(request):
    if request.method == 'POST':
        form = ChangePasswordForm(user=request.user, data=request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            return redirect('profile')
        else:
            # Log form errors to debug
            print(form.errors)
    else:
        form = ChangePasswordForm(user=request.user)
    
    return render(request, 'updatePassword.html', {
        'change_password_form': form,
    })
