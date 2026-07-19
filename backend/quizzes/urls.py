from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    QuizViewSet,
    QuestionViewSet,
    AnswerOptionViewSet,
    UserAnswerViewSet,
)

router = DefaultRouter()
router.register("quizzes", QuizViewSet, basename="quiz")
router.register("questions", QuestionViewSet, basename="question")
router.register("answers", AnswerOptionViewSet, basename="answer")
router.register("user-answers", UserAnswerViewSet, basename="user-answer")

urlpatterns = [
    path("", include(router.urls)),
]