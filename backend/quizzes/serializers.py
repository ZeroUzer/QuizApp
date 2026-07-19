from rest_framework import serializers
from .models import Quiz, Question, AnswerOption


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = [
            "id",
            "question",
            "text",
            "is_correct",
        ]


class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Question
        fields = [
            "id",
            "quiz",
            "text",
            "image",
            "allow_multiple_answers",
            "time_limit",
            "order",
            "options",
        ]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(
        many=True,
        read_only=True,
    )
    questions_count = serializers.SerializerMethodField()
    owner_username = serializers.CharField(
        source="owner.username",
        read_only=True,
    )

    class Meta:
        model = Quiz
        fields = [
            "id",
            "owner",
            "owner_username",
            "title",
            "description",
            "image",
            "category",
            "difficulty",
            "estimated_time",
            "is_public",
            "shuffle_questions",
            "shuffle_answers",
            "created_at",
            "updated_at",
            "questions_count",
            "questions",
        ]

    def get_questions_count(self, obj):
        return obj.questions.count()


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            "title",
            "description",
            "image",
            "category",
            "difficulty",
            "estimated_time",
            "is_public",
            "shuffle_questions",
            "shuffle_answers",
        ]

    def create(self, validated_data):
        # Получаем owner из контекста
        owner = self.context.get("owner")
        return Quiz.objects.create(
            owner=owner,
            **validated_data
        )