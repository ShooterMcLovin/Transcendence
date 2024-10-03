from django.urls import path
from .views import register, login, logout, check_authentication, user_list, update_winner

urlpatterns = [

    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('logout/', logout, name='logout'),
    path('users/', user_list, name='logout'),
    path('update-winner/', update_winner, name='update_winner'),
    path('get_username/', update_winner, name='update_winner'),
    path('check_authentication/', check_authentication, name='check_authentication'),
]