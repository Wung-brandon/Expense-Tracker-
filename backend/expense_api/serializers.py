from .models import Expense, Category, Income, MonthlyReport, Budget
from rest_framework import serializers

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = "__all__"
        exclude = ["created", "updated"]
        

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
        exclude = ["created", "updated"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        exclude = ["created", "updated"]

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = "__all__"
        exclude = ["created", "updated"]

class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
        