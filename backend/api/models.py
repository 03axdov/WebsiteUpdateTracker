from django.db import models
from django.conf import settings

# Create your models here.
class TrackedWebsite(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tracked_websites"
    )
    
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_scraped = models.DateTimeField(null=True)
    
    def __str__(self):
        return f"{self.url} ({self.owner.username})"