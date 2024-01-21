import { ExpenseItem, IncomeItem, InvestmentItem } from "@/model/models";
import { ExpenseService } from "./ExpenseService";
import { GroceryService } from "./GroceryService";
import { IncomeService } from "./IncomeService";
import { InvestmentService } from "./InvestmentService";
import { getRemainingTotal, prepareCloneItems } from "@/app/util/utils";
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

    async clone(year:number,month:number){

        const date = new Date();

        const currMonth = date.getMonth()+1;
        const currYear = date.getFullYear();

        const expenses = await db.expenses.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));

        const incomes = await db.income.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));

        const investments = await db.investments.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));
        
        const groceries = await db.groceries.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));


        console.log("expenses", expenses);
        // expenses.forEach(e => this.expenseService.addNew(e))
        // console.log("incomes", incomes);
        // incomes.forEach(e => this.incomeService.addNew(e))
        // console.log("investments", investments);
        // investments.forEach(e => this.investmentService.addNew(e))
        // console.log("groceries", groceries);
        // groceries.forEach(e => this.groceryService.addNew(e))
        
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