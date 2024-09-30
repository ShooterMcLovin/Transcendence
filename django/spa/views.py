from django.shortcuts import render
from django.http import JsonResponse
# from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth import authenticate, login as django_login, logout as  django_logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .forms import CustomUserCreationForm
from authentication.models import CustomUser, Match, Tournament
from django.middleware.csrf import get_token
from django.templatetags.static import static

# Serve the main SPA HTML file
def index(request):
    context = {
        'user': request.user,
    }
    return render(request, 'index.html', context)



# API to handle user logout


# API to get user profile data
@login_required
@api_view(['GET'])
def profile(request):
    user = request.user
    data = {
        'username': user.username,
        'nickname': user.nickname,
        'wins': user.wins,
        'losses': user.losses,
        'tournament_wins': user.tournament_wins,
        'tournament_losses': user.tournament_losses,
        'avatar_url': user.get_avatar_url()
    }
    return Response(data, status=status.HTTP_200_OK)



@api_view(['GET'])
def check_authentication(request):
    return Response({'isAuthenticated': request.user.is_authenticated})

# API to get a list of all users
@api_view(['GET'])
@login_required
def user_list(request):
    users = CustomUser.objects.all().values('id', 'username', 'nickname', 'wins', 'losses', 'avatar_url')
    return Response(list(users), status=status.HTTP_200_OK)





# API to get all tournaments
@api_view(['GET'])
def get_tournaments(request):
    tournaments = Tournament.objects.all()
    data = [{'id': t.id, 'name': t.name, 'description': t.description} for t in tournaments]
    return Response(data, status=status.HTTP_200_OK)

# API to get all matches
@api_view(['GET'])
def get_matches(request):
    matches = Match.objects.all()
    data = [{'id': m.id, 'winner': m.winner.username, 'loser': m.loser.username, 'match_date': m.match_date} for m in matches]
    return Response(data, status=status.HTTP_200_OK)
