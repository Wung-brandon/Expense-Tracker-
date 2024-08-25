from django.urls import path
from .views import ExpenseSummaryStatsView, IncomeSummaryStatsView, IncomeVsExpenseStatsView, TotalBalanceSummaryView

urlpatterns = [
    path("expense-summary/", ExpenseSummaryStatsView.as_view(), name="expense-summary"),
    path("income-summary/", IncomeSummaryStatsView.as_view(), name="income-summary"),
    path('total-balance/', TotalBalanceSummaryView.as_view(), name='total-balance'),
    path('income-vs-expenses/', IncomeVsExpenseStatsView.as_view(), name='income-vs-expenses'),
]
