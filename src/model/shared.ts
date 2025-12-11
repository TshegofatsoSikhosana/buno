export enum Tab{
    EXPENSES,
    INVESTMENTS,
    INCOME,
    GROCERIES,
    DASHBOARD,
    CAR_LOAN
}

export function isTabActive(type: Tab,active: Tab){
return type == active ? 'active-section' : ''
}