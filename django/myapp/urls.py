from django.urls import path
from . import views

#path(<address extention>, <name of the view(views.py)>, <name>)
urlpatterns = [
    path('', views.index, name='index'), 
    path('pong/', views.pong, name='pong'), 
    path('404/', views.view_404, name='view_404'),
]

