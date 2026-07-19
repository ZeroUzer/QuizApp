from rest_framework import serializers
from .models import Quiz, Question, AnswerOption, UserAnswer


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ["id", "question", "text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "quiz", "text", "order", "options"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            "id", "owner", "owner_username", "title", "description",
            "category", "time_limit", "is_public", "created_at",
            "questions", "questions_count"
        ]

    def get_questions_count(self, obj):
        return obj.questions.count()


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["title", "description", "category", "time_limit", "is_public"]


class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ["id", "question", "selected_option", "is_correct"]

    def create(self, validated_data):
        user = self.context["request"].user
        question = validated_data["question"]
        selected_option = validated_data.get("selected_option")

        is_correct = False
        if selected_option:
            is_correct = selected_option.is_correct

        user_answer, created = UserAnswer.objects.update_or_create(
            user=user,
            question=question,
            defaults={
                "selected_option": selected_option,
                "is_correct": is_correct,
            }
        )
        return user_answer