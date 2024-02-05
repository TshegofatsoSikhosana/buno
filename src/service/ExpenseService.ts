import { db } from "@/config/database.config";
import { ExpenseCategory, ExpenseItem } from "@/model/models";
import { getRemainingTotal, prepareCloneItems } from "@/util/utils";


export class ExpenseService{

    constructor(){

    }

    getActualTotal(type: ExpenseCategory,expenses: ExpenseItem[]){
        let amt:number = 0;
        const data = expenses.filter((e)=> e.category === type)
        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            amt += Number(e.actualAmount);
        }
       
        return amt
    }
    
    getExpectedTotal(type: ExpenseCategory,expenses: ExpenseItem[]){
        let amt:number = 0;
        const data = expenses.filter((e)=> e.category === type)
        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            amt += Number(e.expectedAmount);
        }
       
        return amt
    }

    getRemainingExpenses(expenses:ExpenseItem[]){
        return getRemainingTotal(expenses)
    }


    addNew(expense:ExpenseItem) {
        db.expenses.add(expense);
    }

    update(expense:ExpenseItem){
        db.expenses.put({...expense});
    }

    delete(id:number){
        db.expenses.delete(id);
    }

    async clone(year:number,month:number){

        const date = new Date();

        const currMonth = date.getMonth()+1;
        const currYear = date.getFullYear();

        return await db.expenses.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));
    }

   

    initializeWithTemplate(){
        const expenses: ExpenseItem[] = [
            {
                description: 'Groceries',
                expectedAmount: 1800,
                actualAmount: 1800,
                category: ExpenseCategory.LIVING,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Rent',
                expectedAmount: 6000,
                actualAmount: 6000,
                category: ExpenseCategory.LIVING,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Utilities',
                expectedAmount: 1000,
                actualAmount: 1000,
                category: ExpenseCategory.LIVING,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Transport (Office)',
                expectedAmount: 1000,
                actualAmount: 1000,
                category: ExpenseCategory.LIVING,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Microwave',
                expectedAmount: 1800,
                actualAmount: 1800,
                category: ExpenseCategory.EXCEPTION,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023,
            },
            {
                description: 'Washing Machine',
                expectedAmount: 5000,
                actualAmount: 5132,
                category: ExpenseCategory.EXCEPTION,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023,
            },
            {
                description: 'Matt (Bokke day)',
                expectedAmount: 300,
                actualAmount: 300,
                category: ExpenseCategory.EXCEPTION,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023,
            },
            {
                description: 'Telkom Fibre',
                expectedAmount: 1000,
                actualAmount: 1000,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Absa Life',
                expectedAmount: 295,
                actualAmount: 591,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Sanlam Reality',
                expectedAmount: 125,
                actualAmount: 125,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
           
            {
                description: 'Vodacom Phone',
                expectedAmount: 500,
                actualAmount: 400,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Parents',
                expectedAmount: 1500,
                actualAmount: 1500,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Airtime',
                expectedAmount: 150,
                actualAmount: 227,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Spotify',
                expectedAmount: 80,
                actualAmount: 85,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'SG Domain',
                expectedAmount: 260,
                actualAmount: 260,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Eating Out',
                expectedAmount: 1000,
                actualAmount: 1000,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Kardeigh',
                expectedAmount: 1000,
                actualAmount: 1000,
                category: ExpenseCategory.PERSONAL,
                month: '12',
                dateCreated: Date.now().toString(),
                year: 2023
            },
        ]
        db.expenses.bulkAdd( [...expenses])
    }

} 
