from .models import Expense, Income, MonthlyReport, Budget
from rest_framework import serializers
from django.db.models import Sum
from django.utils import timezone

class IncomeSerializer(serializers.ModelSerializer):
    date = serializers.DateField(read_only=True) 
    class Meta:
        model = Income
        fields = ["id", "user", "amount", "source", "description", "date"]
        read_only_fields = ['id', 'user', 'date']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Income amount must be positive.")
        return value
    def create(self, validated_data):
        # Ensure that 'date' is set to today if not provided
        validated_data['date'] = timezone.now().date()
        return super().create(validated_data)


class ExpenseSerializer(serializers.ModelSerializer):
    date = serializers.DateField(read_only=True) 
    class Meta:
        model = Expense
        fields = ["id", "amount", "category", 'user', "description", "date"]
        read_only_fields = ['id', 'user', 'date']
    def create(self, validated_data):
        # Ensure that 'date' is set to today if not provided
        validated_data['date'] = timezone.now().date()
        return super().create(validated_data)

    # def validate(self, data):
    #     # Validate positive expense amount
    #     if data['amount'] <= 0:
    #         raise serializers.ValidationError("Expense amount must be positive.")

    #     # Check if the user has sufficient income to cover the expense
    #     user = self.context['request'].user
    #     total_income = Income.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
    #     total_expenses = Expense.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
    #     total_budget = Budget.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0

    #     if total_income == 0:
    #         raise serializers.ValidationError("No income found. Please add income before creating an expense.")

    #     if total_expenses + data['amount'] > total_income:
    #         raise serializers.ValidationError("Total expenses exceed total income.")
        
    #     if total_budget > total_income:
    #         raise serializers.ValidationError("Total budget exceeds total income.")

    #     return data


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["id", "amount", 'user', "month"]
        read_only_fields = ['user']

    def validate(self, data):
        # Validate positive budget amount
        if data['amount'] <= 0:
            raise serializers.ValidationError("Budget amount must be positive.")

        # Check if the user has sufficient income for the budget
        user = self.context['request'].user
        month = data.get('month', timezone.now())
        start_date = month.replace(day=1)
        end_date = (start_date + relativedelta(months=1)) - timezone.timedelta(days=1)

        total_income = Income.objects.filter(user=user, date__range=(start_date, end_date)).aggregate(Sum('amount'))['amount__sum'] or 0
        total_budget = Budget.objects.filter(user=user, month=month).aggregate(Sum('amount'))['amount__sum'] or 0

        if total_income == 0:
            raise serializers.ValidationError("No income found for this month. Please add income before creating a budget.")
        
        if data['amount'] + total_budget > total_income:
            raise serializers.ValidationError("Total budget for this month exceeds total income.")

        return data


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = "__all__"
