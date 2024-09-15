import datetime
from django.db.models import Sum
from expense_api.models import Expense, Income, Budget
from rest_framework.views import APIView
from dateutil.relativedelta import relativedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import TruncWeek, ExtractWeekDay
from django.utils import timezone
import pytz
from expense_api.serializers import ExpenseSerializer

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

class WeeklySummaryStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today_date = datetime.date.today()
        start_date = today_date - relativedelta(weeks=52)  # Start from 52 weeks ago (one year)

        # Aggregate income data by week
        income_summary = Income.objects.filter(
            user=request.user,
            date__range=(start_date, today_date)
        ).annotate(week=TruncWeek('date')).values('week').annotate(
            total_income=Sum('amount')
        ).order_by('week')

        # Aggregate expense data by week
        expense_summary = Expense.objects.filter(
            user=request.user,
            date__range=(start_date, today_date)
        ).annotate(week=TruncWeek('date')).values('week').annotate(
            total_expense=Sum('amount')
        ).order_by('week')

        # Aggregate budget data by week
        budget_summary = Budget.objects.filter(
            user=request.user,
            month__range=(start_date, today_date)
        ).annotate(week=TruncWeek('month')).values('week').annotate(
            total_budget=Sum('amount')
        ).order_by('week')

        # Prepare data structure to hold the weekly summary
        weekly_summary = {}

        # Process income data by week
        for entry in income_summary:
            week_str = entry['week'].strftime('%Y-%W')  # Format as Year-Week
            if week_str not in weekly_summary:
                weekly_summary[week_str] = {
                    'income': 0, 'expenses': 0, 'budget': 0, 
                    'income_sources': [], 'expense_categories': []
                }
            weekly_summary[week_str]['income'] = entry['total_income']

            # Get income source summary for the current week
            income_source_summary = Income.objects.filter(
                user=request.user,
                date__week=entry['week'].isocalendar()[1],
                date__year=entry['week'].year
            ).values('source').annotate(total_amount=Sum('amount')).order_by('source')
            weekly_summary[week_str]['income_sources'] = list(income_source_summary)

        # Process expense data by week
        for entry in expense_summary:
            week_str = entry['week'].strftime('%Y-%W')  # Format as Year-Week
            if week_str not in weekly_summary:
                weekly_summary[week_str] = {
                    'income': 0, 'expenses': 0, 'budget': 0, 
                    'income_sources': [], 'expense_categories': []
                }
            weekly_summary[week_str]['expenses'] = entry['total_expense']

            # Get expense category summary for the current week
            expense_category_summary = Expense.objects.filter(
                user=request.user,
                date__week=entry['week'].isocalendar()[1],
                date__year=entry['week'].year
            ).values('category').annotate(total_amount=Sum('amount')).order_by('category')
            weekly_summary[week_str]['expense_categories'] = list(expense_category_summary)

        # Process budget data by week
        for entry in budget_summary:
            week_str = entry['week'].strftime('%Y-%W')  # Format as Year-Week
            if week_str not in weekly_summary:
                weekly_summary[week_str] = {
                    'income': 0, 'expenses': 0, 'budget': 0, 
                    'income_sources': [], 'expense_categories': []
                }
            weekly_summary[week_str]['budget'] = entry['total_budget']

        # Convert to list of dictionaries for JSON serialization
        result = [{'week': week, **data} for week, data in weekly_summary.items()]

        return Response({"weekly_summary": result}, status=status.HTTP_200_OK)

class MonthlyExpensesView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated
    

    def get(self, request, year, month):
        """
        Fetch all expenses for the given month and year.
        """
        try:
            # Get the first and last date of the month
            start_date = timezone.datetime(year=year, month=month, day=1)
            # Get the last day of the month
            if month == 12:
                end_date = timezone.datetime(year=year + 1, month=1, day=1) - timezone.timedelta(days=1)
            else:
                end_date = timezone.datetime(year=year, month=month + 1, day=1) - timezone.timedelta(days=1)

            # Filter expenses for the logged-in user within the date range
            expenses = Expense.objects.filter(user=request.user, date__range=(start_date, end_date))
            

            # Serialize the expenses data
            serializer = ExpenseSerializer(expenses, many=True)
            response = {
                "expenses": serializer.data,
                }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class DayOfWeekExpensesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get the current year and week
        today = datetime.date.today()
        current_week = today.isocalendar()[1]  # Get the ISO week number
        current_year = today.year

        # Optionally, the user can pass `week` and `year` in the query params
        week = request.query_params.get('week', current_week)  # Use current week if not provided
        year = request.query_params.get('year', current_year)  # Use current year if not provided

        # Query to calculate total spent per day of the specific week
        expenses = Expense.objects.filter(
            user=request.user,
            date__week=week,  # Filter by week number
            date__year=year   # Filter by year
        ).annotate(
            day_of_week=ExtractWeekDay('date')  # Extract the day of the week
        ).values('day_of_week').annotate(
            total_spent=Sum('amount')  # Sum the expenses for each day of the week
        ).order_by('day_of_week')
        
        # Initialize data dictionary with default values for each day
        data = {
            "Monday": 0,
            "Tuesday": 0,
            "Wednesday": 0,
            "Thursday": 0,
            "Friday": 0,
            "Saturday": 0,
            "Sunday": 0
        }

        # Map Django's day_of_week numbers (1=Sunday, 2=Monday, ..., 7=Saturday) to day names
        day_mapping = {
            2: "Monday",
            3: "Tuesday",
            4: "Wednesday",
            5: "Thursday",
            6: "Friday",
            7: "Saturday",
            1: "Sunday",
        }

        # Update data based on the query results
        for expense in expenses:
            day = expense["day_of_week"]
            day_name = day_mapping.get(day)
            if day_name:
                data[day_name] = expense["total_spent"]

        return Response({
            "week": week,
            "year": year,
            "day_data": data
        })
        
class CurrentDayExpensesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the current time in the user's local timezone (Africa/Douala)
        user_timezone = pytz.timezone('Africa/Douala')  # Set timezone to Cameroon
        now = timezone.now().astimezone(user_timezone)  # Convert current time to local timezone
        
        # Calculate start and end of the current day in the user's timezone
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Filter expenses that fall within the start and end of the day for the user
        today_expenses = Expense.objects.filter(
            user=request.user,
            date__range=(today_start, today_end)
        ).values("category").annotate(
            total_spent=Sum("amount")
        ).order_by("category")

        data = {}
        for expense in today_expenses:
            data[expense["category"]] = expense["total_spent"]
        
        return Response({
            "current_day": data
        })