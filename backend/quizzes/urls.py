from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AnswerOptionViewSet,
    QuestionViewSet,
    QuizViewSet,
)

router = DefaultRouter()
router.register("quizzes", QuizViewSet, basename="quiz")
router.register("questions", QuestionViewSet, basename="question")
router.register("answers", AnswerOptionViewSet, basename="answer")

urlpatterns = [
    path("", include(router.urls)),
]