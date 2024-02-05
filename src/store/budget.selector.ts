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

export const getCloneIncomes = createSelector(
    getDataState,
    (state)=> state.budget?.incomes
);
