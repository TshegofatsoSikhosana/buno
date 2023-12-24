import { db } from "@/config/database.config";
import { ExpenseCategory, ExpenseItem } from "@/model/models";
import { log } from "console";
import { useLiveQuery } from "dexie-react-hooks";
import ExpenseItemForm from "./ExpenseItemForm";
import { useEffect, useState } from "react";
import { ExpenseService } from "@/service/ExpenseService";
import editSvg from '../../assets/edit-icon.svg'
import deleteSvg from '../../assets/garbage-icon.svg'
import Image from "next/image";
import RowActions from "../RowActions";
interface ExpensesProps {
    year: number
}
 
function Expenses(props: ExpensesProps){

    const expenses = useLiveQuery(() => db.expenses.where({year: props.year}).toArray());
    const [openForm,setOpenForm] = useState(false);
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [selectedExpenseCategory,setSelectExpenseCatergory] = useState<ExpenseCategory | undefined>()
    

    const es = new ExpenseService();


    function getActualTotal(type: ExpenseCategory){
        let amt:number = 0;
        if(expenses){
            return es.getActualTotal(type,expenses);
        }
       
        return amt
    }
    
    function getExpectedTotal(type: ExpenseCategory){
        if(expenses){
           return es.getExpectedTotal(type,expenses);
        }
        return 0
    }
    function handleAddExpenseItem(selectedItem: ExpenseItem){
        if(selectedItem){
            es.addNew( {...selectedItem})
        }
        setOpenForm(false)
    }

    function handleItemClick(index:number, category?: ExpenseCategory | undefined){
        console.log("Selected", index); 
        setSelectedItem(index+1);

        setSelectExpenseCatergory(category);
    }

    function handleEditExpenseItem(selectedItem: ExpenseItem){
        if(selectedItem){
            es.update( {...selectedItem})
        }
        setOpenForm(false)
    }

    function deleteItem(index:number){
        const expense = getItem();
        if(expense){
            console.log('deleting', expense)
            es.delete(Number(expense.id))
        return <dialog open>Deleted</dialog>
        }
    }

    function isSelected(category:ExpenseCategory){
        return Number(selectedExpenseCategory) === Number(category);
    }

    function getItem(){
        if(expenses){
            return expenses.filter((e)=> e.category == selectedExpenseCategory)[selectedItem-1]
        }
        return undefined
    }

    return <>
      { openForm ? <ExpenseItemForm 
                                handleAddExpenseItem={handleAddExpenseItem}
                                handleEditExpsenseItem={handleEditExpenseItem}
                                item={expenses && Number(selectedItem) >= 0 ? getItem() : undefined} />:( 
                    <button
                        className="p-2 mb-2 btn-add"
                        style={{borderRadius: '8px', border:'2px solid grey'}}
                        onClick={(e)=> setOpenForm(true)}>Add Expense</button>
                )}
                <div className='w-11/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' ></div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Actual
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Expected
                    </div>
                </div>
                <div className='w-11/12 grid-flow-row' >
                    <div className='w-6/12 p-2 inline-block'  ></div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.LIVING) + getActualTotal(ExpenseCategory.PERSONAL) + getActualTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.LIVING) + getExpectedTotal(ExpenseCategory.PERSONAL) + getExpectedTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                </div>
                <div className='w-11/12 grid-flow-row  mt-5'  style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                    <div className='w-6/12 p-2 inline-block font-bold' >Living Expenses</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.LIVING)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.LIVING)}
                    </div>
                </div>
                {expenses?.filter((e)=> e.category === ExpenseCategory.LIVING).map((expense, index)=>{
                    return <div 
                                className='w-11/12 grid-flow-row row-text-block'
                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                key={index}
                                onClick={(e)=> handleItemClick(index,ExpenseCategory.LIVING)}
                                onMouseLeave={(e)=> handleItemClick(-1)}>
                                    <div className='w-1/12 inline-block text-center' > 
                                    {Number(selectedItem) - 1 === index  && isSelected(ExpenseCategory.LIVING) ? 
                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                        : <></>
                                    }
                                    </div>
                                    <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                        {expense.description}
                                       
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> 
                                        R{expense.actualAmount}
                                    </div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.expectedAmount}</div>
                </div>
                })}
                 <div className='w-11/12 grid-flow-row  mt-5' style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                    <div className='w-6/12 p-2 inline-block font-bold' >Exception Expenses</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                </div>
                {expenses?.filter((e)=> e.category === ExpenseCategory.EXCEPTION).map((expense, index)=>{
                    return <div className='w-11/12 grid-flow-row row-text-block' 
                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                key={index}
                                onClick={(e)=> handleItemClick(index, ExpenseCategory.EXCEPTION)}
                                onMouseLeave={(e)=> handleItemClick(-1)}>
                                <div className='w-1/12 inline-block text-center' > 
                                    {Number(selectedItem) - 1 === index  && isSelected(ExpenseCategory.EXCEPTION) ? 
                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                        : <></>
                                    }
                                </div>
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{expense.description}</div>
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.actualAmount}</div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.expectedAmount}</div>
                </div>
                })}
                <div className='w-11/12 grid-flow-row  mt-5' style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                    <div className='w-6/12 p-2 inline-block font-bold' >Personal Expenses</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.PERSONAL)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.PERSONAL)}
                    </div>
                </div>
                {expenses?.filter((e)=> e.category === ExpenseCategory.PERSONAL).map((expense, index)=>{
                    return <div className='w-11/12 grid-flow-row row-text-block'
                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                key={index}
                                onClick={(e)=> handleItemClick(index,ExpenseCategory.PERSONAL)}
                                onMouseLeave={(e)=> handleItemClick(-1)}>
                                <div className='w-1/12 inline-block text-center' > 
                                    {Number(selectedItem) - 1 === index  && isSelected(ExpenseCategory.PERSONAL)? 
                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                        : <></>
                                    }
                                </div>
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{expense.description}</div>
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.actualAmount}</div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.expectedAmount}</div>
                </div>
                })}
        </>;
}
 
export default Expenses;