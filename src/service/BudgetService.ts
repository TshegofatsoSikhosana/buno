import { ExpenseService } from "./ExpenseService";
import { GroceryService } from "./GroceryService";
import { IncomeService } from "./IncomeService";
import { InvestmentService } from "./InvestmentService";


export class BudgetService {

    expenseService = new ExpenseService();
    groveryService = new GroceryService();
    incomeService = new IncomeService();
    investmentService = new InvestmentService();

    constructor() {
        
    }

    clone(year:number,month:number){
        const expenses = this.expenseService.
    }
}