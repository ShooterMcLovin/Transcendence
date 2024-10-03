from django.shortcuts import render
from django.contrib.auth import authenticate, login as django_login, logout as  django_logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from .models import CustomUser, Match, Tournament
from .forms import CustomUserCreationForm
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

def get_username(request):
    user = request.user
    return Response({'username': user.nickname}) #nickname or username?

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
@login_required
def user_list(request):
    users = CustomUser.objects.all().values('id', 'username', 'nickname', 'wins', 'losses', 'avatar_url')
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