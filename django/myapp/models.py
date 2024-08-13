from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    nickname = models.CharField(max_length=5, blank=True, null=True)
    wins = models.PositiveIntegerField(default=0)  # Counter for wins
    losses = models.PositiveIntegerField(default=0)  # Counter for losses

    tournement_wins = models.PositiveIntegerField(default=0)  # Counter for wins
    tournement_losses = models.PositiveIntegerField(default=0)  # Counter for losses
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
