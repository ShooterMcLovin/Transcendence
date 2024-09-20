from rest_framework import serializers
from .models import CustomUser, Match, Friendship, Tournament, Challenge

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'nickname', 'wins', 'losses', 'tournament_wins', 'tournament_losses', 'avatar_url', 'is_online']

class MatchSerializer(serializers.ModelSerializer):
    winner = CustomUserSerializer()
    loser = CustomUserSerializer()

    class Meta:
        model = Match
        fields = ['id', 'winner', 'loser', 'match_date', 'game', 'details']

class FriendshipSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    friend = CustomUserSerializer()

    class Meta:
        model = Friendship
        fields = ['id', 'user', 'friend', 'is_friend']

class TournamentSerializer(serializers.ModelSerializer):
    participants = CustomUserSerializer(many=True)
    matches = MatchSerializer(many=True)

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'participants', 'matches']

class ChallengeSerializer(serializers.ModelSerializer):
    challenger = CustomUserSerializer()
    challenged = CustomUserSerializer()

    class Meta:
        model = Challenge
        fields = ['id', 'challenger', 'challenged', 'is_accepted', 'is_complete']
