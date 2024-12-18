import { CloneBudget } from "@/model/models";
import { ExpenseService } from "./ExpenseService";
import { GroceryService } from "./GroceryService";
import { IncomeService } from "./IncomeService";
import { InvestmentService } from "./InvestmentService";
import { getRemainingTotal, prepareCloneItems } from "@/util/utils";
import { db } from "@/config/database.config";


export class BudgetService {

    expenseService = new ExpenseService();
    groceryService = new GroceryService();
    incomeService = new IncomeService();
    investmentService = new InvestmentService();

    constructor() {
        
    }

    getRemainingTotal(items: any[]){
        return getRemainingTotal(items);
    }

    async initializeBudgetClone(year:number,month:number, nextYear: number, nextMonth: number){      
         
        const expenses = await db.expenses.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((e)=> prepareCloneItems(e,nextMonth,nextYear));

        console.log('Expenses', expenses);
        
        const incomes = await db.income.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((e)=> prepareCloneItems(e,nextMonth,nextYear));

        const investments = await db.investments.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((e)=> prepareCloneItems(e,nextMonth,nextYear));
        
        const groceries = await db.groceries.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((e)=> prepareCloneItems(e,nextMonth,nextYear));

        const cloneBudget =  {
                year: year,
                month: month,
                expenses: expenses,
                incomes:incomes,
                investments: investments,
                groceries: groceries
            } as CloneBudget
        
        return cloneBudget;
    }

    async cloneBudget(budget: CloneBudget){
        db.expenses.bulkAdd(budget.expenses);
        db.income.bulkAdd(budget.incomes)
        db.investments.bulkAdd(budget.investments)
        db.groceries.bulkAdd(budget.groceries)

        console.log("expenses", budget);
    }

    export(year:number,month:number, type: 'json' | 'csv'){

    }

    updateItems(data:any[], month:number,year:number){
        data.forEach((item)=>{
            item.year = year;
            item.month = month;
            item.actualAmount = 0;
            item.dateCreated = Date.now();
            item.id = undefined;
        })
        return data
    }
}