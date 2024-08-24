from django.urls import path
from .views import ExpenseSummaryStatsView, IncomeSummaryStatsView, IncomeVsExpenseStatsView

urlpatterns = [
    path("expense-summary/", ExpenseSummaryStatsView.as_view(), name="expense-summary"),
    path("income-summary/", IncomeSummaryStatsView.as_view(), name="income-summary"),
    path('income-vs-expenses/', IncomeVsExpenseStatsView.as_view(), name='income-vs-expenses'),
]
