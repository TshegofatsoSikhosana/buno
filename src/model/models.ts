export interface GroceryItem{
    id?: number
    description: string,
    quantity: number,
    expectedAmount: number,
    actualAmount: number,
    discountAmount?: number,
    month?: string,
    year?: number,
    dateCreated?: string,
    store?: Store
}


export enum Store{
    PNP,
    CHECKERS,
    FOODLOVERS,
    CLICKS,
    WOOLWORTHS,
    DISCHEM,
    OTHER
}

export interface BusinessPaymentItem{
    id?: number
    dateCreated?: string,
    description: string,
    expectedAmount: number,
    amount: number,
    businessExpectedId: number,
    month?: string,
    year?: number,
}

export interface BusinessExpectedItem{
    id?: number
    description: string,
    dateCreated?: string,
    amount: number,
    businessId: number,
    month?: string,
    year?: number,
    payments?: BusinessPaymentItem[];
}


export interface BusinessItem{
    id?: number;
    name: string;
    dateCreated: string;
    expectedItems?: BusinessExpectedItem[];
}

export enum ExpenseCategory{
    LIVING,
    PERSONAL,
    EXCEPTION
}


export interface ExpenseItem{
    id?: number
    description: string,
    category?: ExpenseCategory,
    expectedAmount: number,
    actualAmount: number,
    month?: string,
    year?: number,
    dateCreated?: string,
    exception?: true
}

export interface InvestmentItem{
    id?: number
    description: string,
    bank?: string,
    expectedAmount: number,
    actualAmount: number,
    month?: string,
    year?: number,
    dateCreated?: string,
}

export interface IncomeItem{
    id?: number
    description: string,
    category: string,
    expectedAmount: number,
    actualAmount: number,
    month: string,
    year: number,
    dateCreated: string
}

export interface GoalItem{
    id?: number;
    name: string;
    targetAmount: number;
    targetYear: number;
    dateCreated: string;
    entries?: GoalEntry[];
}


export interface GoalEntry{
    id?: number;
    goalId: number;
    amount: number;
    month?: string;
    year?: number;
    dateCreated: string;
}


export interface CloneBudget{
    year: number;
    month: number;
    expenses:ExpenseItem[];
    incomes: IncomeItem[];
    investments: InvestmentItem[];
    groceries: GroceryItem[]
}