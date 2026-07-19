from django.conf import settings
from django.db import models

from quizzes.models import AnswerOption, Question, Quiz


class GameSession(models.Model):
    class Status(models.TextChoices):
        WAITING = "waiting", "Ожидание"
        ACTIVE = "active", "Игра"
        FINISHED = "finished", "Завершена"

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="sessions",
        verbose_name="Квиз",
    )

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organized_sessions",
        verbose_name="Организатор",
    )

    room_code = models.CharField(
        max_length=8,
        unique=True,
        verbose_name="Код комнаты",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.WAITING,
        verbose_name="Статус",
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Начало игры",
    )

    finished_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Окончание игры",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Создано",
    )

    class Meta:
        verbose_name = "Игровая сессия"
        verbose_name_plural = "Игровые сессии"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.room_code} ({self.quiz.title})"


class Participant(models.Model):
    session = models.ForeignKey(
        GameSession,
        on_delete=models.CASCADE,
        related_name="participants",
        verbose_name="Игровая сессия",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="participations",
        verbose_name="Пользователь",
    )

    score = models.PositiveIntegerField(
        default=0,
        verbose_name="Очки",
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Время подключения",
    )

    class Meta:
        verbose_name = "Участник"
        verbose_name_plural = "Участники"
        unique_together = ("session", "user")

    def __str__(self):
        return f"{self.user.username} ({self.session.room_code})"


class UserAnswer(models.Model):
    participant = models.ForeignKey(
        Participant,
        on_delete=models.CASCADE,
        related_name="answers",
        verbose_name="Участник",
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="user_answers",
        verbose_name="Вопрос",
    )

    selected_options = models.ManyToManyField(
        AnswerOption,
        related_name="selected_in_answers",
        verbose_name="Выбранные ответы",
    )

    is_correct = models.BooleanField(
        default=False,
        verbose_name="Ответ верный",
    )

    points = models.PositiveIntegerField(
        default=0,
        verbose_name="Полученные очки",
    )

    answered_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Время ответа",
    )

    class Meta:
        verbose_name = "Ответ пользователя"
        verbose_name_plural = "Ответы пользователей"

    def __str__(self):
        return f"{self.participant.user.username} - {self.question.id}"