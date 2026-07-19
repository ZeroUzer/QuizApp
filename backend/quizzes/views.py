from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from rest_framework import serializers

from .models import Quiz, Question, AnswerOption, UserAnswer
from .serializers import (
    QuizSerializer,
    QuizCreateSerializer,
    QuestionSerializer,
    AnswerOptionSerializer,
    UserAnswerSerializer,
)


class QuizViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == "my":
            return Quiz.objects.filter(owner=self.request.user)
        return Quiz.objects.filter(is_public=True)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuizCreateSerializer
        return QuizSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"])
    def my(self, request):
        queryset = Quiz.objects.filter(owner=request.user)
        serializer = QuizSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Question.objects.filter(quiz__owner=self.request.user)

    def perform_create(self, serializer):
        quiz_id = self.request.data.get("quiz")
        if not quiz_id:
            raise serializers.ValidationError({"quiz": "quiz is required"})
        quiz = Quiz.objects.get(id=quiz_id, owner=self.request.user)
        serializer.save(quiz=quiz)


class AnswerOptionViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerOptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AnswerOption.objects.filter(question__quiz__owner=self.request.user)

    def perform_create(self, serializer):
        question_id = self.request.data.get("question")
        if not question_id:
            raise serializers.ValidationError({"question": "question is required"})
        question = Question.objects.get(id=question_id, quiz__owner=self.request.user)
        serializer.save(question=question)


class UserAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = UserAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAnswer.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def submit(self, request):
        question_id = request.data.get("question_id")
        option_id = request.data.get("option_id")

        if not question_id:
            return Response(
                {"error": "question_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        selected_option = None
        is_correct = False
        
        if option_id:
            try:
                selected_option = AnswerOption.objects.get(id=option_id)
                is_correct = selected_option.is_correct
            except AnswerOption.DoesNotExist:
                return Response(
                    {"error": "Option not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        user_answer, created = UserAnswer.objects.update_or_create(
            user=request.user,
            question=question,
            defaults={
                "selected_option": selected_option,
                "is_correct": is_correct,
            }
        )

        serializer = UserAnswerSerializer(user_answer)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def result(self, request):
        quiz_id = request.query_params.get("quiz_id")

        if not quiz_id:
            return Response(
                {"error": "quiz_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        answers = UserAnswer.objects.filter(
            user=request.user,
            question__quiz_id=quiz_id
        )

        total = answers.count()
        correct = answers.filter(is_correct=True).count()

        return Response({
            "total": total,
            "correct": correct,
            "score": correct,
            "percent": round((correct / total * 100) if total > 0 else 0, 1)
        })