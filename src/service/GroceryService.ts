import { db } from "@/config/database.config";
import { GroceryItem } from "@/model/models";

export class GroceryService{
    constructor(){

    }

    getActualTotal(groceries: GroceryItem[]){
        let amt:number = 0;
        for (let index = 0; index < groceries.length; index++) {
            const e = groceries[index];
            amt += Number(e.actualAmount);
        }
        return amt
    }

    getExpectedTotal(groceries: GroceryItem[]){
        let amt:number = 0;
        for (let index = 0; index < groceries.length; index++) {
            const e = groceries[index];
            amt += Number(e.expectedAmount);
        }
        return amt
    }

    getDiscountTotal(groceries: GroceryItem[]){
        let amt:number = 0;
        for (let index = 0; index < groceries.length; index++) {
            const e = groceries[index];
            amt += Number(e.discountAmount) ? Number(e.discountAmount) : 0;
        }
        return amt
    }


    addNew(grocery:GroceryItem) {
        db.groceries.add(grocery);
    }

    update(grocery:GroceryItem){
        db.groceries.put({...grocery});
    }

    initializeWithTemplate(){
     
    const groceries: GroceryItem[] = [
        {
            description: '6x Milk Litre',
            quantity: 1,
            expectedAmount: 100,
            actualAmount: 100,
            month: 'NOVEMBER',
            dateCreated: Date.now().toString(),
            year: 2023
        },
        {
            description: 'Muesli',
            quantity: 1,
            expectedAmount: 80,
            actualAmount: 96,
            discountAmount: 60,
            month: 'NOVEMBER',
            dateCreated: Date.now().toString(),
            year: 2023
        },
        {
            description: 'Eggs (30)',
            quantity: 1,
            expectedAmount: 120,
            actualAmount: 115,
            month: 'NOVEMBER',
            dateCreated: Date.now().toString(),
            year: 2023
        },
        {
            description: 'Sphagetti',
            quantity: 1,
            expectedAmount: 20,
            actualAmount: 20,
            month: 'NOVEMBER',
            dateCreated: Date.now().toString(),
            year: 2023
        },
    ]

        db.groceries.bulkAdd( [...groceries])
    }

} 