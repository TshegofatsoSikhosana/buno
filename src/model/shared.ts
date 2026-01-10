export enum Tab{
    EXPENSES,
    INVESTMENTS,
    INCOME,
    GROCERIES,
    DASHBOARD,
    GOALS,
    CAR_LOAN
}

export function isTabActive(type: Tab,active: Tab){
return type == active ? 'active-section' : ''
}