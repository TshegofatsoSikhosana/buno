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


    addNew(investment:InvestmentItem) {
        db.investments.add(investment);
    }

    update(investment:InvestmentItem){
        db.investments.put({...investment});
    }

    delete(id:number){
        db.investments.delete(id);
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