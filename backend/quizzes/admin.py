from django.contrib import admin
from .models import Quiz, Question, AnswerOption, UserAnswer


class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    extra = 1


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ["title", "owner", "category", "is_public", "created_at"]
    list_filter = ["is_public", "category"]
    search_fields = ["title", "description"]
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ["text", "quiz", "order"]
    list_filter = ["quiz"]
    search_fields = ["text"]
    inlines = [AnswerOptionInline]


@admin.register(AnswerOption)
class AnswerOptionAdmin(admin.ModelAdmin):
    list_display = ["text", "question", "is_correct"]
    list_filter = ["is_correct", "question__quiz"]
    search_fields = ["text"]


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ["user", "question", "selected_option", "is_correct", "answered_at"]
    list_filter = ["is_correct"]
    search_fields = ["user__username"]