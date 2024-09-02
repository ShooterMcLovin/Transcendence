from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from .models import CustomUser, Friendship, Match, Tournament, Challenge
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm, ChangePasswordForm
from django.templatetags.static import static
from .forms import AvatarForm
from django.db import IntegrityError
from django.http import JsonResponse
from django.utils import timezone

import json

# links to game
def get_usernames(request):
    # Liste des noms d'utilisateur
    usernames = list(CustomUser.objects.values_list('nickname', flat=True))
    return JsonResponse({'usernames': usernames})
def get_username(request):
    # Get the currently logged-in user
    user = request.user

    # Return the username of the logged-in user
    return JsonResponse({'username': user.nickname})

def update_winner(request):
    try:
        data = json.loads(request.body)
        winner_username = data.get('winner')
        loser_username = data.get('loser')
        pgame = data.get('game')

        if winner_username == loser_username:
            return JsonResponse({'status': 'success'})
        if not winner_username or not loser_username:
            return JsonResponse({'status': 'error', 'message': 'Missing winner or loser username'}, status=400)

        # Try to update the winner if not 'AI' or 'IA'
        if winner_username not in ['AaI', 'IaA']:
            try:
                winner = CustomUser.objects.get(nickname=winner_username)
                winner.wins += 1
                winner.save()
            except CustomUser.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'Winner not found: {winner_username}'}, status=404)

        # Try to update the loser if not 'AI' or 'IA'
        if loser_username not in ['AaI', 'IaA']:
            try:
                loser = CustomUser.objects.get(nickname=loser_username)
                loser.losses += 1
                loser.save()
            except CustomUser.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'Loser not found: {loser_username}'}, status=404)

        # Create a match record
        Match.objects.create(
            winner=winner,
            loser=loser,
            game=pgame,
            match_date=timezone.now()
        )

        return JsonResponse({'status': 'success'})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)


@login_required
def del_user(request):
    user = request.user
    logout(request)
    Friendship.objects.filter(user=user).delete()
    Friendship.objects.filter(friend=user).delete()
    user.is_active = False
    user.save()
    return redirect(reverse('logout_done'))

def user_logout(request):
    user = request.user
    user.is_online = False
    user.save()
    logout(request)
    return redirect(reverse('logout_done'))



def home(request):
    context = {
        'user': request.user,
    }
    return render(request, 'home.html', context)

@login_required
def pong(request):
    return render(request, 'pong.html')


def view_404(request):
    return render(request, '404.html')



@login_required
def profile(request):
    user = request.user
    return render(request, 'profile.html',{'user_profile': user})

@login_required
def user_profile(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    friends = user.get_friends()
    
    return render(request, 'user_profile.html' , {'user_profile': user, 'friends': friends})

# credentials
def LoginView(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            user.is_online = True
            user.save()
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
            user.is_online = True
            user.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

# friends management
@login_required
def add_friend(request, user_id):
    """View to add a friend."""
    friend = get_object_or_404(CustomUser, id=user_id)
    user = request.user

    # Check if the user is trying to add themselves
    if user == friend:
        messages.error(request, "You cannot add yourself as a friend.")
        return redirect('profile')

    try:
        # Attempt to create or update the friendship
        friendship, created = Friendship.objects.get_or_create(
            user=user,
            friend=friend,
            defaults={'is_friend': True}
        )
        friendshipr, created = Friendship.objects.get_or_create(
            user=friend,
            friend=user,
            defaults={'is_friend': True}
        )
        if not created:
            if friendship.is_friend:
                messages.info(request, f"You are already friends with {friend.nickname}.")
            else:
                # Reactivate the friendship if it was previously removed
                friendship.is_friend = True
                friendshipr.is_friend = True
                friendship.save()
                friendshipr.save()
                messages.success(request, f"{friend.nickname} has been added back to your friends.")
        else:
            messages.success(request, f"You are now friends with {friend.nickname}.")
    
    except IntegrityError:
        messages.error(request, f"An error occurred while trying to add {friend.nickname} as a friend. Please try again.")
    
    return redirect('profile')
@login_required
def remove_friend(request, user_id):
    """View to remove a friend."""
    friend = get_object_or_404(CustomUser, id=user_id)
    user = request.user
    try:
        friendship = Friendship.objects.get(user=user, friend=friend, is_friend=True)
        friendship.is_friend = False
        friendship.save()
        friendshipr = Friendship.objects.get(user=friend, friend=user, is_friend=True)
        friendshipr.is_friend = False
        friendshipr.save()
        update_session_auth_hash(request, request.user)
        update_session_auth_hash(request, friend)
        messages.success(request, f"{friend.nickname} has been removed from your friends.")
    except Friendship.DoesNotExist:
        messages.error(request, f"{friend.nickname} is not in your friend list.")
    update_session_auth_hash(request, request.user)
    return redirect('profile')
@login_required
def my_friends(request):
    """View to display a list of user's friends."""
    user = request.user
    friends = user.friendships.filter(is_friend=True).select_related('friend')
    challenges = Challenge.objects.filter(challenged=user, is_accepted=False)
    pending_challenges = Challenge.objects.filter(challenger=user, is_accepted=False)
    context = {
        'friends': [f.friend for f in friends],
        'challenges': challenges,
        'pending_challenges': pending_challenges,
        }
    return render(request, 'my_friends.html', context)

# Updates
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

# User List
@login_required
def user_list(request):
    """View to list all users."""
    users = CustomUser.objects.all()
    friendships = {user.id: Friendship.objects.filter(user=request.user, friend=user, is_friend=True).exists() for user in users}
    friendships_dict = {user.id: user.id in friendships for user in users}
    context = {
        'users': users,
        'friendships': friendships_dict,
        'logged_in_user': request.user,
    }
    return render(request, 'user_list.html', context)

# 404
def view_404(request, exception=None):
    return render(request, '404.html', status=404)

@login_required
def match_history(request):
    """View to display the match history of the logged-in user."""
    user = request.user
    matches_won = Match.objects.filter(winner=user).order_by('-match_date')
    matches_lost = Match.objects.filter(loser=user).order_by('-match_date')
    
    # Get all matches and associated tournaments
    matches = matches_won.union(matches_lost).order_by('-match_date')
    
    # Get all tournaments (optional: filter by current or past tournaments)
    tournaments = Tournament.objects.all().order_by('-start_date')

    context = {
        'matches_won': matches_won,
        'matches_lost': matches_lost,
        'matches': matches,
        'tournaments': tournaments,  # Add tournaments to context
    }
    return render(request, 'matchHistory.html', context)

@login_required
def user_history(request, user_id):
    """View to display the match history of the logged-in user."""
    gooduser = get_object_or_404(CustomUser, id=user_id)
    matches_won = Match.objects.filter(winner=gooduser).order_by('-match_date')
    matches_lost = Match.objects.filter(loser=gooduser).order_by('-match_date')
    
    # Get all matches and associated tournaments
    matches = Match.objects.all().order_by('-match_date')
    
    # Get all tournaments (optional: filter by current or past tournaments)
    tournaments = Tournament.objects.all().order_by('-start_date')

    context = {
        'matches_won': matches_won,
        'matches_lost': matches_lost,
        'matches': matches,
        'tournaments': tournaments,  # Add tournaments to context
    }
    return render(request, 'userHistory.html', context)

@login_required
def ttt_challenge(request, user_id):
    """View to create a challenge from the current user to another user."""
    challenger = request.user
    challenged = get_object_or_404(CustomUser, id=user_id)
    
    # Prevent challenging oneself
    if challenger == challenged:
        return render(request, 'ttt.html' , {'Challenger': challenger, 'Challenged': challenger})

    # Check if the challenge already exists
    existing_challenge = Challenge.objects.filter(
        challenger=challenger,
        challenged=challenged
    ).first()
    
    if existing_challenge and not existing_challenge.is_accepted:
        messages.info(request, f"You already challeneged {challenged.nickname}.")
        return redirect('profile')  # or provide a message to the user
    else:
        # Create a new challenge
        if (existing_challenge):
            existing_challenge.is_accepted = False
        else:
            Challenge.objects.create(
                challenger=challenger,
                challenged=challenged,
                is_accepted=False
            )
    messages.success(request, f"You successfuly challeneged {challenged.nickname}.")
    
    return redirect('profile')

def accept_challenge(request, user_id):
    challenged = request.user
    challenger = get_object_or_404(CustomUser, id=user_id)
    challenge = Challenge.objects.get(challenged=challenged, challenger=challenger, is_accepted=False)
    challenge.is_accepted = True
    challenge.delete()
    # challenge.save()

    return render(request, 'ttt.html' , {'Challenger': challenger, 'Challenged': challenged})




def manage(request):
    clients = CustomUser.objects.all()
    return render(request, 'manage.html', {'clients': clients})
    # return render(request, 'profile')

def Activate(request, user_id):
    target = get_object_or_404(CustomUser, id=user_id)
    clients = CustomUser.objects.all()
    if target.is_active:
        messages.error(request, target.nickname + ' is already active')
        return redirect('profile')
    if not target.is_active:
        target.is_active = True
        target.save()
        messages.success(request, target.nickname +' has been activated')
    return redirect('profile')
    # return render(request, 'manage.html', {'clients': clients})

def DeActivate(request, user_id):
    target = get_object_or_404(CustomUser, id=user_id)
    clients = CustomUser.objects.all()
    if target.username == 'Master':
        messages.error(request, 'Cannot deactivate main account')
        return redirect('profile')
    if not target.is_active:
        messages.error(request, target.nickname + ' is already dactivated')
        return redirect('profile')
    if target.is_active:
        if target.username != 'Master':
            target.is_active = False
            target.save()
            messages.success(request, target.nickname + 'has been deactivated')
    return redirect('profile')
    # return render(request, 'manage.html', {'clients': clients})

def Makestaff(request, user_id):
    target = get_object_or_404(CustomUser, id=user_id)
    
    if target.is_staff:
        messages.error(request, target.nickname + ' is already staff')
    clients = CustomUser.objects.all()
    if not target.is_staff:
        target.is_staff = True
        target.save()
        messages.success(request, target.nickname + ' is now staff')
    return redirect('profile')
    # return render(request, 'manage.html', {'clients': clients})
    
def Remstaff(request, user_id):
    target = get_object_or_404(CustomUser, id=user_id)
    if target.username == 'Master':
        messages.error(request, 'Cannot remove main accounts rights')
        return redirect('profile')

    if not target.is_staff:
        messages.error(request, target.nickname + ' is not staff')

    if target.is_staff:
        target.is_staff = False
        target.save()
        messages.success(request, target.nickname + ' is no more staff')
    return redirect('profile')
    # return render(request, 'manage.html', {'clients': clients})
    