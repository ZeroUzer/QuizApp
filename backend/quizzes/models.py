from django.db import models
from django.conf import settings


class Quiz(models.Model):

    class Difficulty(models.TextChoices):
        EASY = "easy", "Лёгкий"
        MEDIUM = "medium", "Средний"
        HARD = "hard", "Сложный"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="quizzes"
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="quiz_images/",
        blank=True,
        null=True
    )

    category = models.CharField(
        max_length=100,
        default="Другое"
    )

    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM
    )

    estimated_time = models.PositiveIntegerField(
        default=10,
        help_text="Примерное время прохождения (минуты)"
    )

    is_public = models.BooleanField(
        default=True
    )

    shuffle_questions = models.BooleanField(
        default=False
    )

    shuffle_answers = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title


class Question(models.Model):

    quiz = models.ForeignKey(
        Quiz,
        related_name="questions",
        on_delete=models.CASCADE
    )

    text = models.TextField()

    image = models.ImageField(
        upload_to="question_images/",
        blank=True,
        null=True
    )

    allow_multiple_answers = models.BooleanField(
        default=False
    )

    time_limit = models.IntegerField(
        default=30
    )

    order = models.IntegerField(
        default=0
    )

    def __str__(self):
        return self.text


class AnswerOption(models.Model):

    question = models.ForeignKey(
        Question,
        related_name="options",
        on_delete=models.CASCADE
    )

    text = models.CharField(
        max_length=255
    )

    is_correct = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.text