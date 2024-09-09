import datetime
from django.db.models import Sum
from expense_api.models import Expense, Income, Budget
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
        # expense_summary_list = list(expense_summary)
        total_expenses_amount = total_expenses['total_expense'] or 0  # Handle None case

        # Debug print statement (optional)
        print(f"Expenses: {expense_summary}")
        print(f"total_expenses: {total_expenses}")

        # Return JSON response
        return Response(
            {"category_data" : expense_summary,
             "total_expenses" : total_expenses_amount,
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

        # Query to get total amount spent per source
        income_summary = Income.objects.filter(
            user=request.user, 
            date__range=(a_month_ago, today_date)
        ).values('source').annotate(total_amount=Sum('amount')).order_by('source')
        
        total_income = Income.objects.filter(user=request.user, date__range=(a_month_ago, today_date)).aggregate(total_income=Sum('amount'))
       
        total_income_amount = total_income['total_income'] or 0  # Handle None case

        # Return JSON response
        return Response(
            {"income_source_data" : income_summary,
             "total_income" : total_income_amount,
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

        # Prepare the data for each month
        monthly_summary = []
        months = set([entry['date__month'] for entry in income_summary] + [entry['date__month'] for entry in expense_summary])
        for month in sorted(months):
            income_amount = next((entry['total_income'] for entry in income_summary if entry['date__month'] == month), 0)
            expense_amount = next((entry['total_expense'] for entry in expense_summary if entry['date__month'] == month), 0)
            monthly_summary.append({
                'month': f"{today_date.year}-{month:02d}",
                'income': income_amount,
                'expenses': expense_amount
            })

        return Response({"income_vs_expenses_summary": monthly_summary})
    
class ExpenseVsBudgetStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today_date = datetime.date.today()
        a_month_ago = today_date - relativedelta(months=1)

        # Aggregate budget data for the current month
        budget_summary = Budget.objects.filter(
            user=request.user,
            month__year=today_date.year,
            month__month=today_date.month
        ).aggregate(total_budget=Sum('amount'))
        
        total_budget = budget_summary['total_budget'] or 0

        # Aggregate expense data
        expense_summary = Expense.objects.filter(
            user=request.user, 
            date__range=(a_month_ago, today_date)
        ).values('date__month').annotate(
            total_expense=Sum('amount')
        ).order_by('date__month')

        # Prepare the data for each month
        monthly_summary = []
        months = set([today_date.month] + [entry['date__month'] for entry in expense_summary])
        for month in sorted(months):
            # Format month as YYYY-MM
            month_str = f"{today_date.year}-{month:02d}"

            # Get budget data (assuming a single month budget)
            budget_amount = total_budget if month == today_date.month else 0

            # Get expense data
            expense_amount = next((entry['total_expense'] for entry in expense_summary if entry['date__month'] == month), 0)

            monthly_summary.append({
                'month': month_str,
                'budget': budget_amount,
                'expenses': expense_amount
            })

        return Response({"budget_vs_expenses_summary": monthly_summary})
    
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
        total_budget = Budget.objects.filter(
            user=request.user,
            month__year=today_date.year,
            month__month=today_date.month
        ).aggregate(total_budget=Sum('amount'))['total_budget'] or 0
        return Response(
                         {
                             f"total_income": total_income_amount,
                             f"total_budget": total_budget,
                            f"total_expenses": total_expenses_amount,
                            f"total_balance": total_balance_amount,
                         }
                        )
        

class MonthlySummaryStatsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        today_date = datetime.date.today()
        start_date = today_date.replace(day=1) - relativedelta(years=1)  # Start from a year ago

        # Aggregate income data by month
        income_summary = Income.objects.filter(
            user=request.user,
            date__range=(start_date, today_date)
        ).values('date__year', 'date__month').annotate(
            total_income=Sum('amount')
        ).order_by('date__year', 'date__month')

        # Aggregate expense data by month
        expense_summary = Expense.objects.filter(
            user=request.user,
            date__range=(start_date, today_date)
        ).values('date__year', 'date__month').annotate(
            total_expense=Sum('amount')
        ).order_by('date__year', 'date__month')

        # Aggregate budget data by month
        budget_summary = Budget.objects.filter(
            user=request.user,
            month__range=(start_date, today_date)
        ).values('month__year', 'month__month').annotate(
            total_budget=Sum('amount')
        ).order_by('month__year', 'month__month')

        # Prepare data structure to hold the monthly summary
        monthly_summary = {}

        # Process income data by month
        for entry in income_summary:
            year_month = f"{entry['date__year']}-{entry['date__month']:02d}"
            if year_month not in monthly_summary:
                monthly_summary[year_month] = {
                    'income': 0, 'expenses': 0, 'budget': 0, 
                    'income_sources': [], 'expense_categories': []
                }
            monthly_summary[year_month]['income'] = entry['total_income']

            # Get income source summary for the current month
            income_source_summary = Income.objects.filter(
                user=request.user,
                date__year=entry['date__year'],
                date__month=entry['date__month']
            ).values('source').annotate(total_amount=Sum('amount')).order_by('source')
            monthly_summary[year_month]['income_sources'] = list(income_source_summary)

        # Process expense data by month
        for entry in expense_summary:
            year_month = f"{entry['date__year']}-{entry['date__month']:02d}"
            if year_month not in monthly_summary:
                monthly_summary[year_month] = {
                    'income': 0, 'expenses': 0, 'budget': 0, 
                    'income_sources': [], 'expense_categories': []
                }
            monthly_summary[year_month]['expenses'] = entry['total_expense']

            # Get expense category summary for the current month
            expense_category_summary = Expense.objects.filter(
                user=request.user,
                date__year=entry['date__year'],
                date__month=entry['date__month']
            ).values('category').annotate(total_amount=Sum('amount')).order_by('category')
            monthly_summary[year_month]['expense_categories'] = list(expense_category_summary)

        # Process budget data by month
        for entry in budget_summary:
            year_month = f"{entry['month__year']}-{entry['month__month']:02d}"
            if year_month not in monthly_summary:
                monthly_summary[year_month] = {
                    'income': 0, 'expenses': 0, 'budget': 0, 
                    'income_sources': [], 'expense_categories': []
                }
            monthly_summary[year_month]['budget'] = entry['total_budget']

        # Convert to list of dictionaries for JSON serialization
        result = [{'month': month, **data} for month, data in monthly_summary.items()]

        return Response({"monthly_summary": result}, status=status.HTTP_200_OK)
    
