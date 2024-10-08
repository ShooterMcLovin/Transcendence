from django.urls import path
from .views import register, login, logout, check_authentication, user_list, get_username, get_usernames, update_winner, user_profile, match_history, add_friend, getUser, remove_friend

urlpatterns = [

    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('logout/', logout, name='logout'),
    path('getUser/', getUser, name='getUSer'),
    path('get-username/', get_username, name='getUSer'),
    path('get-usernames/', get_usernames, name='getUSers'),
    path('users/', user_list, name='user_list'),
    path('update-winner/', update_winner, name='update_winner'),
    path('add_friend/<int:user_id>/', add_friend, name='add_friend'),
    path('remove_friend/<str:username>/', remove_friend, name='remove_friend'),
    path('user_profile/', user_profile, name='user_profile'),
    path('match_history/', match_history, name='match_history'),
    path('check_authentication/', check_authentication, name='check_authentication'),
]