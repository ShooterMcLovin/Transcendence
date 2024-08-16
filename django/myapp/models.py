from django.contrib.auth.models import AbstractUser
from django.db import models
from django.templatetags.static import static


class CustomUser(AbstractUser):
    nickname = models.CharField(max_length=5, blank=True, null=True)
    wins = models.PositiveIntegerField(default=0)  # Counter for wins
    losses = models.PositiveIntegerField(default=0)  # Counter for losses
    tournament_wins = models.PositiveIntegerField(default=0)  # Counter for wins
    tournament_losses = models.PositiveIntegerField(default=0)  # Counter for losses
    
    avatar_url = models.URLField(blank=True, null=True)

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
    def get_avatar_url(self):
        if self.avatar_url:
            return self.avatar_url
        return static('images/42-logo.png')



class Match(models.Model): 
    winner = models.ForeignKey(CustomUser, related_name='won_matches', on_delete=models.CASCADE)
    loser = models.ForeignKey(CustomUser, related_name='lost_matches', on_delete=models.CASCADE)
    match_date = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)  # Additional details about the match

    def __str__(self):
        return f"{self.winner.nickname} vs {self.loser.nickname} on {self.match_date}"

class Friendship(models.Model):
    user = models.ForeignKey(CustomUser, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(CustomUser, related_name='friend_of', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_friend = models.BooleanField(default=True)  # Status of the friendship

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"{self.user.nickname} is friends with {self.friend.nickname}"