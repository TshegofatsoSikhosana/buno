import { db } from "@/config/database.config";
import { ExpenseCategory, ExpenseItem } from "@/model/models";
import { log } from "console";
import { useLiveQuery } from "dexie-react-hooks";
import ExpenseItemForm from "./ExpenseItemForm";
import { useState } from "react";
import { ExpenseService } from "@/service/ExpenseService";

interface ExpensesProps {
    
}
 
function Expenses(){

    const expenses = useLiveQuery(() => db.expenses.toArray());
    const [openForm,setOpenForm] = useState(false);

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

    return <>
                { openForm ? <ExpenseItemForm handleAddExpenseItem={handleAddExpenseItem} />:( 
                    <button
                        className="p-2 mb-2 btn-add"
                            style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                            onClick={(e)=> setOpenForm(true)}>
                                Add Expense
                    </button>)
                }
                
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
                    return <div className='w-11/12 grid-flow-row' style={{border: '1px solid rgb(70, 70, 80,180)'}} key={index}>
                                <div className='w-1/12 inline-block'></div>
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{expense.description}</div>
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.actualAmount}</div>
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
                    return <div className='w-11/12 grid-flow-row' style={{border: '1px solid rgb(70, 70, 80,180)'}} key={index}>
                                <div className='w-1/12 inline-block'></div>
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
                    return <div className='w-11/12 grid-flow-row' style={{border: '1px solid rgb(70, 70, 80,180)'}} key={index}>
                               <div className='w-1/12 inline-block'></div>
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{expense.description}</div>
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.actualAmount}</div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.expectedAmount}</div>
                </div>
                })}
        </>;
}
 
export default Expenses;