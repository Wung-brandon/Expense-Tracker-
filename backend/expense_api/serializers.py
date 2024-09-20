from .models import Expense, Income, MonthlyReport, Budget
from rest_framework import serializers
from django.db.models import Sum
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from accounts.utils import send_notification
import datetime

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
    date = serializers.DateField(read_only=True)  # Automatically set the date
    class Meta:
        model = Expense
        fields = ["id", "amount", "category", "user", "description", "date"]
        read_only_fields = ['id', 'user', 'date']

    def create(self, validated_data):
        # Ensure that 'date' is set to today if not provided
        validated_data['date'] = timezone.now().date()
        return super().create(validated_data)

    def validate(self, data):
        # Validate positive expense amount
        if data['amount'] <= 0:
            raise serializers.ValidationError("Expense amount must be positive.")
        
        user = self.context['request'].user
        date = data.get('date', timezone.now().date())

        # Get the start and end of the month for the expense date
        start_date = date.replace(day=1)
        end_date = (start_date + relativedelta(months=1)) - timezone.timedelta(days=1)

        # Calculate total income, budget, and expenses for the month
        total_income = Income.objects.filter(user=user, date__range=(start_date, end_date)).aggregate(Sum('amount'))['amount__sum'] or 0
        total_budget = Budget.objects.filter(user=user, month__range=(start_date, end_date)).aggregate(Sum('amount'))['amount__sum'] or 0
        total_expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).aggregate(total_expense=Sum('amount'))['total_expense'] or 0

        # Validation: Ensure the user has income and doesn't exceed it
        if total_income == 0:
            raise serializers.ValidationError("No income found. Please add income before creating an expense.")

        if total_expenses + data['amount'] > total_income:
            raise serializers.ValidationError("Total expenses exceed total income.")

        if total_budget > total_income:
            raise serializers.ValidationError("Total budget exceeds total income.")
        
        remaining_budget = total_budget - total_expenses
        new_remaining_budget = remaining_budget - data['amount']
        formatted_date = date.strftime('%B %Y')
        current_year = date.today().year
        print("current_year", current_year)
        
        if new_remaining_budget == 0:
            subject = f"Budget Limit Reached for {formatted_date}"
            context = {
                "user" : user,
                "date" : formatted_date,
                "total_budget" : total_budget,
                'new_expense': data['amount'],
                "total_expenses" : total_expenses,
                "remaining_budget" : remaining_budget,
                "current_year" : current_year,
                "new_remaining_budget" : new_remaining_budget
            }
            template_path = "budgetLimit/budget_Limit.html"
        
            send_notification(user, subject, template_path, context)
        # Notify user if expenses are approaching or exceeding budget
        elif (remaining_budget <= 1000) or (remaining_budget - data['amount'] <= 1000):
            # user_email = user.email
            subject = f"Approaching Budget Limit for {formatted_date}"
            context = {
                'user': user,
                'date': formatted_date,
                "current_year": current_year,
                'remaining_budget': remaining_budget,
                'new_expense': data['amount'],
                'new_remaining_budget' : new_remaining_budget  
            }
            template_path = "budget_approach/approaching_email.html"
            send_notification(user, subject, template_path, context)

        return data


class BudgetSerializer(serializers.ModelSerializer):
    month = serializers.DateField(read_only=True)
    class Meta:
        model = Budget
        fields = ["id", "amount", 'user', 'description', "month"]
        read_only_fields = ['id','user', 'month']
        
    def create(self, validated_data):
        # Ensure that 'date' is set to today if not provided
        validated_data['month'] = timezone.now().date()
        return super().create(validated_data)

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
        total_budget = Budget.objects.filter(user=user, month__range=(start_date, end_date)).aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = Expense.objects.filter(user=user, date__range=[start_date, end_date]).aggregate(total_expense=Sum('amount'))['total_expense'] or 0


        if total_income == 0:
            raise serializers.ValidationError("No income found for this month. Please add income before creating a budget.")
        
        if data['amount'] + total_budget > total_income:
            raise serializers.ValidationError("Total budget cannot exceed total income for this month.")

        return data


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = "__all__"
