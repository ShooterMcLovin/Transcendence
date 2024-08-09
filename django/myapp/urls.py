from django.urls import path
from .views import user_logout
from django.views.generic import TemplateView
from . import views
from .views import user_list


#path(<address extention>, <name of the view(views.py)>, <name>)
urlpatterns = [
    path('', views.home, name='home'), 
    # path('', views.index, name='index'), 
    path('pong/', views.pong, name='pong'), 
    # path('login/', views.login, name='login'), 
    path('profile/', views.profile, name='profile'), 
    path('register/', views.register, name='register'), 
    path('login/', views.LoginView, name='login'),
    path('404/', views.view_404, name='view_404'),
    path('logout/', user_logout, name='logout'),
    path('logout/', views.user_logout, name='logout'),
    path('logout/done/', TemplateView.as_view(template_name='logout.html'), name='logout_done'),
    path('users/', views.user_list, name='user_list'),
]
