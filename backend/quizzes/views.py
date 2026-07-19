from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Quiz, Question, AnswerOption

from .serializers import (
    QuizSerializer,
    QuizCreateSerializer,
    QuestionSerializer,
    AnswerOptionSerializer,
)


class QuizViewSet(viewsets.ModelViewSet):

    permission_classes = [permissions.IsAuthenticated]

    queryset = Quiz.objects.all().prefetch_related(
        "questions__options"
    )


    def get_serializer_class(self):

        if self.action in ["create", "update", "partial_update"]:

            return QuizCreateSerializer

        return QuizSerializer


    def get_queryset(self):

        if self.action == "my":

            return Quiz.objects.filter(
                owner=self.request.user
            ).prefetch_related(
                "questions__options"
            )


        return Quiz.objects.filter(
            is_public=True
        ).prefetch_related(
            "questions__options"
        )


    def perform_create(self, serializer):

        serializer.save(
            owner=self.request.user
        )


    @action(
        detail=False,
        methods=["get"],
    )
    def my(self, request):

        serializer = QuizSerializer(
            self.get_queryset(),
            many=True,
        )

        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):

    serializer_class = QuestionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(self):

        return Question.objects.filter(
            quiz__owner=self.request.user
        ).prefetch_related(
            "options"
        )


class AnswerOptionViewSet(viewsets.ModelViewSet):

    serializer_class = AnswerOptionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(self):

        return AnswerOption.objects.filter(
            question__quiz__owner=self.request.user
        )