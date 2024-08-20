from django.urls import path
from .views import user_logout
from django.views.generic import TemplateView
from . import views


#path(<address extention>, <name of the view(views.py)>, <name>)
urlpatterns = [
    path('', views.home, name='home'), 
    path('pong/', views.pong, name='pong'), 
    path('pongAI/', views.pongA, name='pongA'), 
    path('profile/', views.profile, name='profile'), 
    path('register/', views.register, name='register'), 
    path('login/', views.LoginView, name='login'),
    path('404/', views.view_404, name='view_404'),
    path('logout/', user_logout, name='logout'),
    path('logout/', views.user_logout, name='logout'),
    path('logout/done/', TemplateView.as_view(template_name='logout.html'), name='logout_done'),
    path('users/', views.user_list, name='user_list'),
    path('pong/api/get-usernames/', views.get_usernames, name='get_usernames'),
    path('api/get-usernames/', views.get_usernames, name='get_usernames'),
    path('api/get-username/', views.get_username, name='get_username'),
    path('pong/api/get-username/', views.get_username, name='get_username'),
    path('api/update-winner/', views.update_winner, name='update_winner'),
    path('update-avatar/', views.update_avatar, name='update_avatar'),
    path('update_password/', views.update_password, name='update_password'), 
    path('update_profile/', views.update_profile, name='update_profile'), 
    path('add_friend/<int:user_id>/', views.add_friend, name='add_friend'),
    path('remove_friend/<int:user_id>/', views.remove_friend, name='remove_friend'),
    path('my_friends/', views.my_friends, name='my_friends'),
]