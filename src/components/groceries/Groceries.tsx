import { db } from "@/config/database.config";
import {GroceryItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import GroceryItemForm from "./GroceryItemForm";
import { GroceryService } from "@/service/GroceryService";

interface GroceryProps {
    year: number
}
 
function Groceries(props: GroceryProps){

    const [openForm,setOpenForm] = useState(false);
    const groceries  =useLiveQuery(() => db.groceries.where({year: props.year}).toArray());
    const gs = new GroceryService();
    function getActualTotal(){
        let amt:number = 0;
        if(groceries){
           return gs.getActualTotal(groceries)
        }
        return amt
    }

    function getDiscountTotal(){
        let amt:number = 0;
        if(groceries){
            return gs.getDiscountTotal(groceries)
        }
        return amt
    }

    function getExpectedTotal(){
        let amt:number = 0;
        if(groceries){
            return gs.getExpectedTotal(groceries)
        }
        return amt
    }

    function handleAddGroceryItem(selectedItem: GroceryItem){
        if(selectedItem){
            gs.addNew( {...selectedItem})
        }
        setOpenForm(false)
    }

    return <>
                { openForm ? <GroceryItemForm handleAddGroceryItem={handleAddGroceryItem} />:( 
                    <button
                        className="p-2 mb-2 btn-add"
                        style={{borderRadius: '8px', border:'2px solid grey'}}
                        onClick={(e)=> setOpenForm(true)}>Add Grocery Item</button>
                )}
                <div>
                    <div className='w-6/12 text-end grid-flow-row p-2 font-bold inline-block'> 
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        Actual
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        Discount
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        Expected
                    </div>
                </div>
                <div>
                    <div className='w-6/12 text-start grid-flow-row p-2 font-bold inline-block'> 
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        R{getActualTotal()}
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        R{getDiscountTotal()}
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        R{getExpectedTotal()}
                    </div>
                </div>
                {groceries?.map((expense, index)=>{
                    return <div className='w-100 grid-flow-row row-text-block' style={{border: '1px solid grey'}} key={index}>
                            <div className='w-6/12 p-2 inline-block' style={{borderLeft: '2px solid grey'}}>{expense.description}</div>
                            <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.actualAmount}</div>
                            <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.discountAmount}</div>
                            <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.expectedAmount}</div>
                        </div>
                })}
        </>;
}
 
export default Groceries;