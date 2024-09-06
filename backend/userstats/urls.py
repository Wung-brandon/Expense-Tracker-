from django.urls import path
from .views import ExpenseSummaryStatsView, IncomeSummaryStatsView, IncomeVsExpenseStatsView, TotalBalanceSummaryView, ExpenseVsBudgetStatsView, MonthlySummaryStatsView

urlpatterns = [
    path("expense-summary/", ExpenseSummaryStatsView.as_view(), name="expense-summary"),
    path("income-summary/", IncomeSummaryStatsView.as_view(), name="income-summary"),
    path('monthly-summary/', MonthlySummaryStatsView.as_view(), name='monthly-summary'),
    path('total/', TotalBalanceSummaryView.as_view(), name='total'),
    path('income-vs-expenses/', IncomeVsExpenseStatsView.as_view(), name='income-vs-expenses'),
    path('budget-vs-expenses/', ExpenseVsBudgetStatsView.as_view(), name='budget-vs-expenses'),
]
