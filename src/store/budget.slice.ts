import { CloneBudget, ExpenseItem, GroceryItem, IncomeItem, InvestmentItem } from "@/model/models";
import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";


export const BUDGET_KEY_FEATURE = 'budget'

export interface BudgetState{
    budget: CloneBudget
}
const budgetTypeAdapter = createEntityAdapter();


const initialBudgetState: BudgetState = budgetTypeAdapter.getInitialState({
    budget: {
        expenses:[],
        groceries:[],
        incomes:[],
        investments:[],
        month: 1,
        year: 1
    }
});



const budgetSlice = createSlice({
    name: BUDGET_KEY_FEATURE,
    initialState: initialBudgetState,
    reducers: {
        setCloneBudget: (state: BudgetState, action: PayloadAction<CloneBudget>) => {
            state.budget = action.payload;
        },
        resetCloneBudget: (state: BudgetState)=>{
            state.budget = initialBudgetState.budget;
        },
        initializeExpenses:(state: BudgetState, action: PayloadAction<ExpenseItem[]>) => {
            state.budget.expenses = action.payload
        },
        initializeIncomes:(state: BudgetState, action: PayloadAction<IncomeItem[]>) => {
            state.budget.incomes = action.payload
        },
        initializeInvestments:(state: BudgetState, action: PayloadAction<InvestmentItem[]>) => {
            state.budget.investments = action.payload
        },
        initializeGroceries:(state: BudgetState, action: PayloadAction<GroceryItem[]>) => {
            state.budget.groceries = action.payload
        }
    }

})

export const budgetReducer = budgetSlice.reducer;

export const budgetActions = budgetSlice.actions;