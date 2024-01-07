import { ExpenseItem, IncomeItem, InvestmentItem } from "@/model/models";
import { ExpenseService } from "./ExpenseService";
import { GroceryService } from "./GroceryService";
import { IncomeService } from "./IncomeService";
import { InvestmentService } from "./InvestmentService";
import { getRemainingTotal } from "@/app/util/utils";


export class BudgetService {

    expenseService = new ExpenseService();
    groveryService = new GroceryService();
    incomeService = new IncomeService();
    investmentService = new InvestmentService();

    constructor() {
        
    }

    getRemainingTotal(items: any[]){
        return getRemainingTotal(items);
    }

    clone(year:number,month:number){
    }

    export(year:number,month:number, type: 'json' | 'csv'){

    }
}