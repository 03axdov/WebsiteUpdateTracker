from rest_framework import serializers
from .models import TrackedWebsite

class TrackedWebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedWebsite
        fields = ("id", "url", "title", "description", "notify_email", "created_at", "last_scraped")
        read_only_fields = ("id", "created_at", "last_scraped")
