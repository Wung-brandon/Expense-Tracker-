from .models import Expense, Income, MonthlyReport, Budget
from rest_framework import serializers

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ["id", 'user', "amount", "source", "description", "date"]
        read_only_fields = ['id','user']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ["id", "amount", "category", 'user', "description", "date"]
        read_only_fields = ['id','user']
        

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["id", "amount", 'user', "month"]
        read_only_fields = ['id','user']
        
class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = "__all__"
        