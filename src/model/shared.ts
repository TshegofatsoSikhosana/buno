export enum Tab{
    EXPENSES,
    INVESTMENTS,
    INCOME,
    GROCERIES,
    DASHBOARD
}

export function isTabActive(type: Tab,active: Tab){
return type == active ? 'active-section' : ''
}