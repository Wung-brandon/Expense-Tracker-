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
        
         # Query to get total expenses
        total_expenses = Expense.objects.filter(user=request.user, date__range=(a_month_ago, today_date)).aggregate(total_expense=Sum('amount'))

        # Convert queryset to dictionary for JSON serialization
        expense_summary_list = list(expense_summary)
        total_expenses_amount = total_expenses['total_expense'] or 0  # Handle None case

        # Debug print statement (optional)
        print(f"Expenses: {expense_summary}")
        print(f"Total Expenses: {total_expenses}")

        # Return JSON response
        return Response(
            {"category_data" : expense_summary_list,
             "Total Expenses" : total_expenses_amount,
             },
            
        status=status.HTTP_200_OK)

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
        
        total_income = Income.objects.filter(user=request.user, date__range=(a_month_ago, today_date)).aggregate(total_income=Sum('amount'))

        # Debug print statement (optional)
        print(f"Income: {income_summary}")
        print(f"Total Income: {total_income}")
        
        income_summary_list = list(income_summary)
        total_income_amount = total_income['total_income'] or 0  # Handle None case

        # Return JSON response
        return Response(
            {"income_source_data" : income_summary_list,
             "Total Income" : total_income_amount,
             },
            
            status=status.HTTP_200_OK)
    
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
    
class TotalBalanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        today_date = datetime.date.today()
        a_month_ago = today_date - relativedelta(months=1)
        total_expenses = Expense.objects.filter(user=request.user, date__range=(a_month_ago, today_date)).aggregate(total_expense=Sum('amount'))
        total_expenses_amount = total_expenses['total_expense'] or 0 
        
        total_income = Income.objects.filter(user=request.user, date__range=(a_month_ago, today_date)).aggregate(total_income=Sum('amount')) 
        total_income_amount = total_income['total_income'] or 0 
        
        current_month = datetime.date.today().strftime("%B")
        total_balance_amount = total_income_amount - total_expenses_amount
        return Response(
                         {
                             "total_income": total_income_amount,
                            "total_expenses": total_expenses_amount,
                            f"Total balance for {current_month}": total_balance_amount,
                         }
                        )
        
    