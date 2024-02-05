import { getRemainingTotal, prepareCloneItems } from "@/util/utils";
import { db } from "@/config/database.config";
import { InvestmentItem } from "@/model/models";

export class InvestmentService {
    constructor(){

    }

    getActualTotal(investments: InvestmentItem[]){
        let amt:number = 0;
        for (let index = 0; index < investments.length; index++) {
            const e = investments[index];
            amt += Number(e.actualAmount);
        }
       
        return amt
    }
    
    getExpectedTotal(investments: InvestmentItem[]){
        let amt:number = 0;
        for (let index = 0; index < investments.length; index++) {
            const e = investments[index];
            amt += Number(e.expectedAmount);
        }
       
        return amt
    }

    getRemainingInvestments(investments:InvestmentItem[]){
        return getRemainingTotal(investments);
    }


    addNew(investment:InvestmentItem) {
        db.investments.add(investment);
    }

    update(investment:InvestmentItem){
        db.investments.put({...investment});
    }

    delete(id:number){
        db.investments.delete(id);
    }


    async clone(year:number,month:number){

        const date = new Date();

        const currMonth = date.getMonth()+1;
        const currYear = date.getFullYear();

        return await db.investments.where({year: currYear})
        .and((i)=> Number(i.month) == currMonth)
        .toArray()
        .then((e)=> prepareCloneItems(e,month,year));
    }

    initializeWithTemplate(){
        const investments: InvestmentItem[] = [
            {
                description: 'RA',
                expectedAmount: 2000,
                actualAmount: 2000,
                bank: 'absa',
                month: 'NOVEMBER',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'ASC',
                expectedAmount: 500,
                actualAmount: 1900,
                bank: 'absa',
                month: 'NOVEMBER',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Endowment',
                expectedAmount: 4000,
                actualAmount: 4000,
                bank: 'absa',
                month: 'NOVEMBER',
                dateCreated: Date.now().toString(),
                year: 2023
            },
            {
                description: 'Crypto',
                expectedAmount: 1000,
                actualAmount: 1000,
                bank: 'tyme',
                month: 'NOVEMBER',
                dateCreated: Date.now().toString(),
                year: 2023
            },
          
        ]
        db.investments.bulkAdd( [...investments])
    }
}