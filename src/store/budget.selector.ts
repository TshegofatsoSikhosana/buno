import { createSelector } from "@reduxjs/toolkit";
import { BUDGET_KEY_FEATURE, BudgetState } from "./budget.slice";

const getDataState = (state: {[BUDGET_KEY_FEATURE] : BudgetState}) => state.budget


export const getCloneBudget = createSelector(
    getDataState,
    (state)=> state.budget
);

export const getCloneExpenses = createSelector(
    getDataState,
    (state)=> state.budget?.expenses
);

export const getCloneGroceries = createSelector(
    getDataState,
    (state)=> state.budget?.groceries
);

export const getCloneInvestments = createSelector(
    getDataState,
    (state)=> state.budget?.investments
);
export const getCloneIncomes = createSelector(
    getDataState,
    (state)=> state.budget?.incomes
);

export const getCurrentYear = createSelector(
    getDataState,
    (state)=> state.currentYear
);

export const getCurrentMonth = createSelector(
    getDataState,
    (state)=> state.currentMonth
);
