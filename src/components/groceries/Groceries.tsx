import { db } from "@/config/database.config";
import {GroceryItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import GroceryItemForm from "./GroceryItemForm";
import { GroceryService } from "@/service/GroceryService";
import Image from "next/image";
import editSvg from '../../assets/edit-icon.svg'
import deleteSvg from '../../assets/garbage-icon.svg'
import RowActions from "../RowActions";

interface GroceryProps {
    year: number
}
 
function Groceries(props: GroceryProps){

    const [openForm,setOpenForm] = useState(false);
    const groceries  =useLiveQuery(() => db.groceries.where({year: props.year}).toArray());
    const [selectedItem,setSelectedItem] = useState<number>(-1);

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

    function handleEditGroceryItem(selectedItem: GroceryItem){
        if(selectedItem){
            gs.update( {...selectedItem})
        }
        setOpenForm(false)
    }

    function deleteItem(index: number){
        if(groceries &&     Number(selectedItem) >= 0 ){
            console.log('deleting', groceries[index])
            gs.delete(Number(groceries[index].id))
        return <dialog open>Deleted</dialog>
        }
    }

    return <>
                { openForm ? <GroceryItemForm 
                                handleAddGroceryItem={handleAddGroceryItem}
                                handleEditGroceryItem={handleEditGroceryItem}
                                item={groceries && Number(selectedItem) >= 0 ? groceries[selectedItem-1] : undefined} />:( 
                    <button
                        className="p-2 mb-2 btn-add"
                        style={{borderRadius: '8px', border:'2px solid grey'}}
                        onClick={(e)=> setOpenForm(true)}>Add Grocery Item</button>
                )}
                <div>
                    <div className='w-6/12 text-end grid-flow-row p-2 font-bold inline-block'> 
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        Expected
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        Actual
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        Discount
                    </div>
                </div>
                <div>
                    <div className='w-6/12 text-start grid-flow-row p-2 font-bold inline-block'> 
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        R{getExpectedTotal()}
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        R{getActualTotal()}
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(169,169,169,169)', color:'rgb(30,150,222,255)'}}> 
                        R{getDiscountTotal()}
                    </div>
                </div>
                {groceries?.map((expense, index)=>{
                    return <div 
                            className='w-100 grid-flow-row row-text-block'
                            style={{border: '1px solid grey'}}
                            key={index}
                            onClick={(e)=> setSelectedItem(index+1)}
                            onMouseLeave={(e)=> setSelectedItem(-1)}>
                            <div className='w-1/12 inline-block text-center' > 
                                {Number(selectedItem) - 1 === index ? 
                                    (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                    : <></>
                                }
                            </div>
                            <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid grey'}}>{expense.description}</div>
                            <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.expectedAmount}</div>
                            <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.actualAmount}</div>
                            <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.discountAmount}</div>
                        </div>
                })}
        </>;
}
 
export default Groceries;