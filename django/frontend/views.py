from django.shortcuts import render
from django.contrib.auth import authenticate, login as django_login, logout as  django_logout, update_session_auth_hash
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from .models import CustomUser, Match, Tournament, Friendship
from .forms import CustomUserCreationForm, ChangePasswordForm
import json


# Serve the main SPA HTML file
def index(request):
    context = {
        'user': request.user,
    }
    return render(request, 'index.html', context)


@api_view(['POST'])
def register(request):
    form = CustomUserCreationForm(data=request.data)
    
    if form.is_valid():
        user = form.save()
        user.is_online = True
        
        # Set a default avatar URL if needed
        user.avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg'
        user.save()
        
        django_login(request, user)  # Log in the user after registration
        
        return Response({
            'message': 'Registration successful',
            'user': {
                'username': user.username,
                'nickname': user.nickname,
                'avatar_url': user.avatar_url,  # Include avatar_url in the response
            }
        }, status=status.HTTP_201_CREATED)

    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_username(request):
    user = request.user
    return Response({'username': user.nickname}) #nickname or username?

@api_view(['GET'])
def get_usernames(request):
    # Liste des noms d'utilisateur
    usernames = list(CustomUser.objects.values_list('nickname', flat=True))
    return Response({'usernames': usernames})

# API to handle user login
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        django_login(request, user)
        user.is_online = True
        user.save()
        return Response({'csrfToken': get_token(request)}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def logout(request):
    request.user.is_online = False
    request.user.save()
    django_logout(request)
    return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def check_authentication(request):
    return Response({'isAuthenticated': request.user.is_authenticated})

@api_view(['GET'])
def check_online(request):
    return Response({'isonline': request.user.is_online})


@api_view(['GET'])
def getUser(request):
    user = request.user
    return Response(user.username, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_list(request):
    users = CustomUser.objects.all().values('id', 'username', 'nickname', 'wins', 'losses', 'avatar_url','is_online', 'is_staff')
    return Response(list(users), status=status.HTTP_200_OK)

@api_view(['POST'])
def update_winner(request):
    # Use request.data to access the JSON payload
    winner_username = request.data.get('winner')
    loser_username = request.data.get('loser')
    pgame = request.data.get('game')
    
    #to allow bypass if game mode realx (no usernames just X vs O) 
    if winner_username == loser_username:
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

    if not winner_username or not loser_username:
        return Response({'status': 'error', 'message': 'Missing winner or loser username'}, status=status.HTTP_400_BAD_REQUEST)

    # Try to update the winner if not 'AI' or 'IA'
    if winner_username:
        try:
            winner = CustomUser.objects.get(nickname=winner_username)
            winner.wins += 1
            winner.save()
        except CustomUser.DoesNotExist:
            return Response({'status': 'error', 'message': f'Winner not found: {winner_username}'}, status=status.HTTP_404_NOT_FOUND)

    # Try to update the loser if not 'AI' or 'IA'
    if loser_username :
        try:
            loser = CustomUser.objects.get(nickname=loser_username)
            loser.losses += 1
            loser.save()
        except CustomUser.DoesNotExist:
            return Response({'status': 'error', 'message': f'Loser not found: {loser_username}'}, status=status.HTTP_404_NOT_FOUND)

    # Create a match record
    Match.objects.create(
        winner=winner,
        loser=loser,
        game=pgame,
        match_date=timezone.now()
    )

    return Response({'status': 'success'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_profile(request):
    # Get the user based on the authenticated request
    user = get_object_or_404(CustomUser, id=request.user.id)
    
    # Get the user's friends
    friends = user.get_friends()  
    friends_data = [{
        'username': friend.username,
        'nickname': friend.nickname,
        'wins': friend.wins,
        'losses': friend.losses,
        'tournament_wins': friend.tournament_wins,
        'tournament_losses': friend.tournament_losses,
        'avatar_url': friend.avatar_url or '/static/images/logo.png',
    } for friend in friends]  # Prepare friends data

    # Prepare the user profile data including the current user
    data = {
        'current_user': {
            'username': user.username,
            'nickname': user.nickname,
            'wins': user.wins,
            'losses': user.losses,
            'tournament_wins': user.tournament_wins,
            'tournament_losses': user.tournament_losses,
            'avatar_url': user.avatar_url or '/static/images/logo.png',
        },
        'friends': friends_data,
    }
    
    return Response(data)


@api_view(['GET'])
def match_history(request):
    """View to display the match history of the logged-in user."""
    try:
        user = get_object_or_404(CustomUser, id=request.user.id)

        matches_won = Match.objects.filter(winner=user).order_by('-match_date')
        matches_lost = Match.objects.filter(loser=user).order_by('-match_date')

        # Serialize match data
        match_data_won = [
            {
                'loser_nickname': match.loser.nickname,
                'game': match.game,
                'match_date': match.match_date.strftime('%Y-%m-%d'),  # Format date if needed
                'details': match.details,
            }
            for match in matches_won
        ]

        match_data_lost = [
            {
                'winner_nickname': match.winner.nickname,
                'game': match.game,
                'match_date': match.match_date.strftime('%Y-%m-%d'),  # Format date if needed
                'details': match.details,
            }
            for match in matches_lost
        ]

        tournaments = Tournament.objects.all().order_by('-start_date')
        tournament_data = [
            {
                'name': tournament.name,
                'start_date': tournament.start_date.strftime('%Y-%m-%d'),  # Format date if needed
                'end_date': tournament.end_date.strftime('%Y-%m-%d'),  # Format date if needed
            }
            for tournament in tournaments
        ]

        context = {
            'matches_won': match_data_won,
            'matches_lost': match_data_lost,
            'tournaments': tournament_data,
        }

        return Response(context)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])  # Changed to POST as adding a friend is a modification action
def add_friend(request, user_id):
    """View to add a friend."""
    friend = get_object_or_404(CustomUser, id=user_id)
    user = request.user

    # Check if the user is trying to add themselves
    if user == friend:
        return Response({'message': "You cannot add yourself as a friend."}, status=status.HTTP_200_OK)

    try:
        # Attempt to create the friendship in both directions
        friendship, created = Friendship.objects.get_or_create(
            user=user,
            friend=friend,
            defaults={'is_friend': True}
        )
        friendship_reverse, created_reverse = Friendship.objects.get_or_create(
            user=friend,
            friend=user,
            defaults={'is_friend': True}
        )

        if created:
            return Response({'message': f"You are now friends with {friend.nickname}."}, status=status.HTTP_201_CREATED)
        else:
            if friendship.is_friend:
                return Response({'message': f"You are already friends with {friend.nickname}."}, status=status.HTTP_200_OK)
            else:
                # Reactivate the friendship if it was previously removed
                friendship.is_friend = True
                friendship_reverse.is_friend = True
                friendship.save()
                friendship_reverse.save()
                return Response({'message': f"{friend.nickname} has been added back to your friends."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f"An error occurred while trying to add {friend.nickname} as a friend. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])  # Consider using POST for state-changing operations
def remove_friend(request, username):
    """View to remove a friend."""
    friend = get_object_or_404(CustomUser, username=username)
    user = request.user
    
    try:
        # Remove the friendship for the user
        friendship = Friendship.objects.get(user=user, friend=friend, is_friend=True)
        friendship.is_friend = False
        friendship.save()
        
        # Remove the reverse friendship
        friendship_reverse = Friendship.objects.get(user=friend, friend=user, is_friend=True)
        friendship_reverse.is_friend = False
        friendship_reverse.save()
        
        return Response({'message': f"{friend.nickname} has been removed from your friends."}, status=status.HTTP_200_OK)
    
    except Friendship.DoesNotExist:
        return Response({'message': f"{friend.nickname} is not in your friend list."}, status=status.HTTP_200_OK)

@login_required    
@api_view(['POST'])
def update_password(request):
    form = ChangePasswordForm(user=request.user, data=request.data)
    
    if form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user)  # Important!
        return Response({'message': 'Password updated successfully.'}, status=200)
    else:
        return Response({'errors': form.errors}, status=400)