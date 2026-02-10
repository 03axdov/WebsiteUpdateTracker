from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
import hashlib
from datetime import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
    
    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)


class TrackedWebsite(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tracked_websites"
    )
    
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_scraped = models.DateTimeField(null=True)
    
    notify_email = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.url} ({self.owner.username})"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "url"],
                name="uniq_owner_url"
            )
        ]
                
                
def snapshot_upload_path(instance: "TrackedWebsiteSnapshot", filename: str) -> str:
    dt = instance.created_at or timezone.now()
    return (
        f"scrapes/user_{instance.website.owner_id}/"
        f"website_{instance.website_id}/"
        f"{dt:%Y/%m/%d}/{filename}"
    )


class TrackedWebsiteSnapshot(models.Model):
    website = models.ForeignKey(
        TrackedWebsite,
        on_delete=models.CASCADE,
        related_name="snapshots",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # Useful metadata
    final_url = models.URLField(blank=True)          # after redirects
    status_code = models.PositiveIntegerField(null=True)
    content_type = models.CharField(max_length=200, blank=True)

    # Content
    html_file = models.FileField(upload_to=snapshot_upload_path)
    sha256 = models.CharField(max_length=64, db_index=True, blank=True)
    bytes = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if self.html_file and not self.sha256:
            h = hashlib.sha256()
            self.html_file.seek(0)

            total = 0
            for chunk in self.html_file.chunks():
                total += len(chunk)
                h.update(chunk)

            self.bytes = total
            self.sha256 = h.hexdigest()
            self.html_file.seek(0)

        super().save(*args, **kwargs)
        
        
    def __str__(self):
        return f"{self.website.url} ({self.website.owner.username}) (snapshot)"