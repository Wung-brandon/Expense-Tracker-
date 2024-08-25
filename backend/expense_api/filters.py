from django_filters.rest_framework import FilterSet
from .models import Income, Expense

class ExpenseFilter(FilterSet):
    class Meta:
        model = Expense
        fields = {
            'category': ['exact'],  # Lookup should be in a list
            'amount': ['gt', 'lt'],
            'date': ['gte', 'lte'],
        }
        
class IncomeFilter(FilterSet):
    class Meta:
        model = Income
        fields = {
            'source': ['exact'],  # Lookup should be in a list
            'amount': ['gt', 'lt'],
            'date': ['gte', 'lte'],
        }
