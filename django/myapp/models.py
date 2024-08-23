from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from django.templatetags.static import static


class CustomUser(AbstractUser):
    nickname = models.CharField(max_length=5, blank=True, null=True)
    wins = models.PositiveIntegerField(default=0)  # Counter for wins
    losses = models.PositiveIntegerField(default=0)  # Counter for losses
    tournament_wins = models.PositiveIntegerField(default=0)  # Counter for tournament wins
    tournament_losses = models.PositiveIntegerField(default=0)  # Counter for tournament losses
    avatar_url = models.URLField(blank=True, null=True)

    def get_friends(self):
        return CustomUser.objects.filter(
            id__in=Friendship.objects.filter(
                user=self
            ).values_list('friend', flat=True)
        )

    def is_friend_with(self, user):
        """Check if this user is friends with another user."""
        return Friendship.objects.filter(user=self, friend=user, is_friend=True).exists()
    
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
        """Return the URL of the user's avatar or a default image."""
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
    user = models.ForeignKey(CustomUser, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(CustomUser, related_name='friendships_as_friend', on_delete=models.CASCADE)
    is_friend = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user} -> {self.friend}'
    
class Tournament(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tournaments')
    matches = models.ManyToManyField('Match', blank=True, related_name='tournaments')

    def __str__(self):
        return self.name

    def is_active(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date

    def get_matches(self):
        return self.matches.all()

    def get_participants(self):
        return self.participants.all()

    def get_winner(self):
        """Determine the winner of the tournament based on match results."""
        # This is a placeholder implementation; adjust according to your criteria
        return max(self.participants, key=lambda user: user.wins)

    def get_loser(self):
        """Determine the loser of the tournament based on match results."""
        # This is a placeholder implementation; adjust according to your criteria
        return min(self.participants, key=lambda user: user.losses)