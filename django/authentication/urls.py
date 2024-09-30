from django.urls import path
from .views import register, login, logout

urlpatterns = [
    path('api/login/', login, name='login'),
    path('api/register/', register, name='register'),
    path('api/logout/', logout, name='logout')
]