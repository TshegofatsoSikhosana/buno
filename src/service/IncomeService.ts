import { getRemainingTotal, prepareCloneItems } from "@/app/util/utils";
import { db } from "@/config/database.config";
import { IncomeItem } from "@/model/models";

export class IncomeService {
    constructor(){

    }

    getActualTotal(incomes: IncomeItem[]){
        let amt:number = 0;
        for (let index = 0; index < incomes.length; index++) {
            const e = incomes[index];
            amt += Number(e.actualAmount);
        }
       
        return amt
    }
    
    getExpectedTotal(incomes: IncomeItem[]){
        let amt:number = 0;
        for (let index = 0; index < incomes.length; index++) {
            const e = incomes[index];
            amt += Number(e.expectedAmount);
        }
       
        return amt
    }
    getRemainingIncome(incomes:IncomeItem[]){
        return getRemainingTotal(incomes);
    }

    addNew(income:IncomeItem) {
        db.income.add(income);
    }

    update(income:IncomeItem){
        db.income.put({...income});
    }

    delete(id:number){
        db.income.delete(id);
    }

    async clone(year:number,month:number){

        const date = new Date();

        const currMonth = date.getMonth()+1;
        const currYear = date.getFullYear();

        return await db.income.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));
    }

    initializeWithTemplate(){
        const incomes: IncomeItem[] = [
            {
                description: 'Psybergate',
                expectedAmount: 26360,
                actualAmount: 26360,
                category: 'absa',
                month: 'NOVEMBER',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            
          
        ]
        db.income.bulkAdd( [...incomes])
    }
}