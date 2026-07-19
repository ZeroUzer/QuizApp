from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ORGANIZER = "organizer", "Организатор"
        PARTICIPANT = "participant", "Участник"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.PARTICIPANT
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username