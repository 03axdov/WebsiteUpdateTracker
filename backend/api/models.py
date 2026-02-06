from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
import hashlib


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
            Profile.objects.create(user=instance)


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
    notify_sms = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.url} ({self.owner.username})"
    
    def clean(self):
        super().clean()

        if self.notify_sms:
            profile = getattr(self.owner, "profile", None)
            if not profile or not profile.phone_number:
                raise ValidationError({
                    "notify_sms": "SMS notifications require a phone number in your profile."
                })
                
                
def snapshot_upload_path(instance: "TrackedWebsiteSnapshot", filename: str) -> str:
    # Keep it deterministic and organized
    return f"scrapes/user_{instance.website.owner_id}/website_{instance.website_id}/{instance.created_at:%Y/%m/%d}/{filename}"


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
            self.html_file.seek(0)
            data = self.html_file.read()
            self.bytes = len(data)
            self.sha256 = hashlib.sha256(data).hexdigest()
            self.html_file.seek(0)
        super().save(*args, **kwargs)