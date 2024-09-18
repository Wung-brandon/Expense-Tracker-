from django.urls import path
from .views import ExpenseListCreateView, ExpenseRetrieveUpdateDeleteView, IncomeListCreateView, IncomeRetrieveUpdateDeleteView, BudgetListCreateView, BudgetRetrieveUpdateDeleteView


urlpatterns = [
    # Expense Urls
    path("expense/", ExpenseListCreateView.as_view(), name="expenses"),
    path("expense/<int:id>/", ExpenseRetrieveUpdateDeleteView.as_view(), name="expensesId"),
    
    # Income Urls
    path("income/", IncomeListCreateView.as_view(), name="income"),
    path("income/<int:id>/", IncomeRetrieveUpdateDeleteView.as_view(), name="incomeId"),
    
    # Budget Urls
    path("budget/", BudgetListCreateView.as_view(), name="budget"),
    path("budget/<int:id>/", BudgetRetrieveUpdateDeleteView.as_view(), name="budgetId"),
]
