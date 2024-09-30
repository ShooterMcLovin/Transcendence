from django.shortcuts import render
from django.contrib.auth import authenticate, login as django_login, logout as  django_logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token
from .forms import CustomUserCreationForm

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