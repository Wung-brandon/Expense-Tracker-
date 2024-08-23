from django.urls import path
from .views import ExpenseListCreateView, ExpenseRetrieveUpdateDeleteView, IncomeListCreateView, IncomeRetrieveUpdateDeleteView


urlpatterns = [
    # Expense Urls
    path("expense/", ExpenseListCreateView.as_view(), name="expenses"),
    path("expense/<int:id>/", ExpenseRetrieveUpdateDeleteView.as_view(), name="expensesId"),
    
    # Income Urls
    path("income/", IncomeListCreateView.as_view(), name="income"),
    path("income/<int:id>/", ExpenseRetrieveUpdateDeleteView.as_view(), name="incomeId"),
]
