from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ExpenseSerializer, IncomeSerializer, BudgetSerializer
from .models import Expense, Income, Budget
from .permissions import IsOwner
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ExpenseFilter, IncomeFilter, BudgetFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
import logging

# Create your views here.
class ExpenseListCreateView(ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ExpenseFilter
    filterset_fields = ["category", "amount", "date"]
    search_fields = ["category", "amount"]
    ordering_fields = ["-id", "amount", "date"]
    pagination_class = PageNumberPagination
    
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Expense.objects.all().order_by('-id')
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
class ExpenseRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
   
logger = logging.getLogger(__name__) 
    
class IncomeListCreateView(ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = IncomeFilter
    filterset_fields = ["source", "amount", "date"]
    search_fields = ["source", "description"]
    ordering_fields = ["-id", "amount", "date"]
    pagination_class = PageNumberPagination
    
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Income.objects.all().order_by('-id',)
    
    def perform_create(self, serializer):
        try:
            return serializer.save(user=self.request.user)
        except Exception as e:
            logger.error(f"Error while saving income: {e}")
            raise
    def get_queryset(self):
        try:
            qs = self.queryset.filter(user=self.request.user)
            logger.info(f"Filtering queryset with params: {self.request.GET}")
            return qs
            # return self.queryset.filter(user=self.request.user)
       
        except Exception as e:
            logger.error(f"Error while filtering queryset: {e}")
            raise
class IncomeRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
class BudgetListCreateView(ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BudgetFilter
    filterset_fields = ["amount", "month"]
    search_fields = ["description"]
    ordering_fields = ["-id", "amount", "month"]
    pagination_class = PageNumberPagination
    
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Budget.objects.all().order_by('-id',)
    
    def perform_create(self, serializer):
        try:
            return serializer.save(user=self.request.user)
        except Exception as e:
            logger.error(f"Error while saving budget: {e}")
            raise
    def get_queryset(self):
        try:
            qs = self.queryset.filter(user=self.request.user)
            logger.info(f"Filtering queryset with params: {self.request.GET}")
            return qs
            # return self.queryset.filter(user=self.request.user)
       
        except Exception as e:
            logger.error(f"Error while filtering queryset: {e}")
            raise
class BudgetRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)