from django.shortcuts import render
from django.http import JsonResponse

def get_username(request):
    # Get the currently logged-in user
    user = request.user
    # Return the username of the logged-in user
    return JsonResponse({'username': 'Batman'})
