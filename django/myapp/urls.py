from django.urls import path
from .views import user_logout
from django.views.generic import TemplateView
from . import views


#path(<address extention>, <name of the view(views.py)>, <name>)
urlpatterns = [
    path('', views.home, name='home'), 
    # path('', views.index, name='index'), 
    path('pong/', views.pong, name='pong'), 
    path('pongAI/', views.pongA, name='pongA'), 
    # path('login/', views.login, name='login'), 
    path('profile/', views.profile, name='profile'), 
    path('update_profile/', views.update_profile, name='update_profile'), 
    path('register/', views.register, name='register'), 
    path('login/', views.LoginView, name='login'),
    path('404/', views.view_404, name='view_404'),
    path('logout/', user_logout, name='logout'),
    path('logout/', views.user_logout, name='logout'),
    path('logout/done/', TemplateView.as_view(template_name='logout.html'), name='logout_done'),
    path('users/', views.user_list, name='user_list'),
    # path('update-score/', views.update_score, name='update_score'),
    path('api/update-winner/', views.update_winner, name='update_winner'),
    path('api/get-usernames/', views.get_usernames, name='get_usernames'),
]