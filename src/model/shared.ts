export enum Tab{
    EXPENSES,
    INVESTMENTS,
    INCOME,
    GROCERIES,
    DASHBOARD,
    GOALS,
    CAR_LOAN,
    BUSINESS_ENTRIES,
    BUSINESS_DASHBOARD,
    BUSINESS_EXPENSE
}

export function isTabActive(type: Tab,active: Tab){
return type == active ? 'active-section' : ''
}