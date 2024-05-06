import { db } from "@/config/database.config";
import { ExpenseCategory, ExpenseItem } from "@/model/models";
import ExpenseItemForm from "./ExpenseItemForm";
import { useEffect, useState } from "react";
import { ExpenseService } from "@/service/ExpenseService";
import closeSvg from '../../assets/close.svg'
import Image from "next/image";
import RowActions from "../RowActions";
import FilterSelector from "../FilterSelector";
import { filterItems } from "@/util/utils";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";

interface ExpensesProps {
    setTotalExpenses: (v:number)=> void;
}
 
function Expenses(props: ExpensesProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [expenses,setExpenses] = useState<ExpenseItem[]>([]);
    const [openForm,setOpenForm] = useState(false);
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [filterType,setFilterType] = useState<number>(-1);
    const [selectedExpenseCategory,setSelectExpenseCatergory] = useState<ExpenseCategory | undefined>()
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>()
    const es = new ExpenseService();


    useEffect(()=>{
        if(expenses){
                const e = filterItems(filterType, expenses);
                setFilteredExpenses([...e])
        }
    },[filterType, expenses]);

    useEffect(()=>{
        getExpenses();
    },[month,year]);

    function getExpenses(){
        db.expenses.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setExpenses([...ex]);
            props.setTotalExpenses(es.getRemainingExpenses(ex));
        });
    }

    function getActualTotal(type: ExpenseCategory){
        return filteredExpenses ? es.getActualTotal(type,filteredExpenses) : 0
    }
    
    function getExpectedTotal(type: ExpenseCategory){
        return filteredExpenses ? es.getExpectedTotal(type,filteredExpenses) : 0
    }

    function handleItemClick(index:number, category?: ExpenseCategory | undefined){
        setSelectedItem(index+1);
        setSelectExpenseCatergory(category);
    }

    function deleteItem(index:number){
        const expense = getItem();
        if(expense){
            console.log('deleting', expense)
            es.delete(Number(expense.id))
            getExpenses();
        }
    }

    function isSelected(category:ExpenseCategory){
        return Number(selectedExpenseCategory) === Number(category);
    }

    function getItem(){
        if(filteredExpenses){
            return filteredExpenses.filter((e)=> e.category === selectedExpenseCategory)[selectedItem-1]
        }
        return undefined
    }

    function close(v:boolean){
        setOpenForm(v);
        setSelectedItem(-1);
    }

    return <>
                <button
                    className="p-2 mb-2 btn-add"
                    style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                    onClick={(e)=> setOpenForm(true)}>
                        Add Expense
                </button>
            
                { openForm &&
                    <ExpenseItemForm 
                        open={openForm}
                        setOpen={close}
                        refresh={getExpenses}
                        item={Number(selectedItem) >= 0 ? getItem() : undefined} 
                    />
                }
                <div className='w-11/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' >
                        
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Expected
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Actual
                    </div>
                </div>
                <div className='w-11/12 grid-flow-row' >
                    <div className='w-6/12 inline-block'>
                        <FilterSelector filterType={filterType} setFilterType={setFilterType}/>
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.LIVING) + getExpectedTotal(ExpenseCategory.PERSONAL) + getExpectedTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.LIVING) + getActualTotal(ExpenseCategory.PERSONAL) + getActualTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                </div>
                <div className='w-11/12 grid-flow-row  mt-5'  style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                    <div className='w-6/12 p-2 inline-block font-bold' >Living Expenses</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.LIVING)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.LIVING)}
                    </div>
                </div>
                {filteredExpenses?.filter((e)=> e.category === ExpenseCategory.LIVING).map((expense, index)=>{
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
                                        R{expense.expectedAmount}
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> 
                                        R{expense.actualAmount}
                                    </div>
                                    
                </div>
                })}
                 <div className='w-11/12 grid-flow-row  mt-5' style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                    <div className='w-6/12 p-2 inline-block font-bold' >Exception Expenses</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.EXCEPTION)}
                    </div>
                </div>
                {filteredExpenses?.filter((e)=> e.category === ExpenseCategory.EXCEPTION).map((expense, index)=>{
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
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.expectedAmount}</div>
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.actualAmount}</div>
                </div>
                })}
                <div className='w-11/12 grid-flow-row  mt-5' style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                    <div className='w-6/12 p-2 inline-block font-bold' >Personal Expenses</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal(ExpenseCategory.PERSONAL)}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)',color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal(ExpenseCategory.PERSONAL)}
                    </div>
                </div>
                {filteredExpenses?.filter((e)=> e.category === ExpenseCategory.PERSONAL).map((expense, index)=>{
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
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.expectedAmount}</div>
                                <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{expense.actualAmount}</div>
                </div>
                })}
        </>;
}
 
export default Expenses;