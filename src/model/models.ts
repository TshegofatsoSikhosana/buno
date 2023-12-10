export interface GroceryItem{
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
    FOODLOVERS
}

export enum ExpenseCategory{
    LIVING,
    PERSONAL,
    EXCEPTION
}


export interface ExpenseItem{
    description: string,
    category: ExpenseCategory,
    expectedAmount: number,
    actualAmount: number,
    month?: string,
    year?: number,
    dateCreated?: string,
    exception?: true
}

export interface InvestmentItem{
    description: string,
    bank: string,
    expectedAmount: number,
    actualAmount: number,
    month?: string,
    year?: number,
    dateCreated?: string,
}

export interface IncomeItem{
    description: string,
    category: string,
    expectedAmount: number,
    actualAmount: number,
    month: string,
    year: number,
    dateCreated: string
}