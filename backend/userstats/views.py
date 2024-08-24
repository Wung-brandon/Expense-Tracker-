import datetime
from django.db.models import Sum
from expense_api.models import Expense, Income
from rest_framework.views import APIView
from dateutil.relativedelta import relativedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class ExpenseSummaryStatsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        today_date = datetime.date.today()
        a_month_ago = today_date - relativedelta(months=1)

        # Debug print statements (optional)
        print(f"Current Date: {today_date}")
        print(f"Date a Month Ago: {a_month_ago}")

        # Query to get total amount spent per category
        expense_summary = Expense.objects.filter(
            user=request.user, 
            date__range=(a_month_ago, today_date)
        ).values('category').annotate(total_amount=Sum('amount')).order_by('category')

        # Debug print statement (optional)
        print(f"Expenses: {expense_summary}")

        # Return JSON response
        return Response({"category_data" : expense_summary}, status=status.HTTP_200_OK)

class IncomeSummaryStatsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        today_date = datetime.date.today()
        a_month_ago = today_date - relativedelta(months=1)

        # Debug print statements (optional)
        # print(f"Current Date: {today_date}")
        # print(f"Date a Month Ago: {a_month_ago}")

        # Query to get total amount spent per category
        income_summary = Income.objects.filter(
            user=request.user, 
            date__range=(a_month_ago, today_date)
        ).values('source').annotate(total_amount=Sum('amount')).order_by('source')

        # Debug print statement (optional)
        print(f"Expenses: {income_summary}")

        # Return JSON response
        return Response({"income_source_data" : income_summary}, status=status.HTTP_200_OK)
    
class IncomeVsExpenseStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today_date = datetime.date.today()
        a_month_ago = today_date - relativedelta(months=1)

        # Aggregate income data
        income_summary = Income.objects.filter(
            user=request.user, 
            date__range=(a_month_ago, today_date)
        ).values('date__month').annotate(
            total_income=Sum('amount')
        ).order_by('date__month')

        # Aggregate expense data
        expense_summary = Expense.objects.filter(
            user=request.user, 
            date__range=(a_month_ago, today_date)
        ).values('date__month').annotate(
            total_expense=Sum('amount')
        ).order_by('date__month')

        # Prepare the response
        income_data = {entry['date__month']: entry['total_income'] for entry in income_summary}
        expense_data = {entry['date__month']: entry['total_expense'] for entry in expense_summary}

        # Combine the results into a single dictionary
        result = {
            'income': income_data,
            'expenses': expense_data
        }

        return Response({"income-vs-expenses data": result})