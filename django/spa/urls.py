from django.urls import path , include
from django.views.generic import TemplateView
from . import views
from .views import index, register, login, logout, profile, get_tournaments, get_matches, user_list

# from rest_framework.routers import DefaultRouter
# from rest_framework.authtoken.views import obtain_auth_token


# router = DefaultRouter()
# router.register(r'users', views.CustomUserViewSet)
# router.register(r'matches', views.MatchViewSet)
# router.register(r'friendships', views.FriendshipViewSet)
# router.register(r'tournaments', views.TournamentViewSet)
# router.register(r'challenges', views.ChallengeViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    # path('api/get-username/', views.get_username, name='get-username'),
    path('', index, name='index'),  # Serve SPA HTML
    # path('login/', login, name='login'),
    path('api/login/', login, name='login'),
    path('api/register/', register, name='register'),
    path('api/users/', user_list, name='user_list'),
    path('api/logout/', logout, name='logout'),
    path('api/profile/', profile, name='profile'),
    path('api/tournaments/', get_tournaments, name='get_tournaments'),
    path('api/matches/', get_matches, name='get_matches')
]