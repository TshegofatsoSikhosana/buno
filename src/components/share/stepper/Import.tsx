import Image from "next/image";
import { useState } from "react";
import { db } from "@/config/database.config";
import { ExpenseItem, GroceryItem, IncomeItem, InvestmentItem } from "@/model/models";
import { useDispatch, useSelector } from "react-redux";
import { budgetActions, budgetSelectors } from "@/store";

interface ImportProps{
    handleOnClose: () => void
}

function Import(props: ImportProps) {
    const {handleOnClose} = props;
    const dispatch = useDispatch();
    const [isImported, setIsImported] = useState(false);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [data, setData] = useState<any>(undefined);

    async function handleOnImport(){
        await db.expenses.bulkPut(data.expenses as ExpenseItem[]);
        await db.income.bulkPut(data.incomes as IncomeItem[]);
        await db.investments.bulkPut(data.investments as InvestmentItem[]);
        await db.groceries.bulkPut(data.groceries as GroceryItem[]);

        setIsImported(true);


        setTimeout(() => {
            dispatch(budgetActions.setCurrentMonth(0))
            dispatch(budgetActions.setCurrentYear(0))
            dispatch(budgetActions.setCurrentMonth(month))
            dispatch(budgetActions.setCurrentYear(year))
            handleOnClose();
        }, 1500);
    }

    async function handleOnFileChange(e: any){

        const file = e.target.files[0]
        if(file){
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const parseData = JSON.parse(content);
                    setData(parseData);
                } catch (error) {
                    console.log('errro', error);
                    
                }
            }
            reader.readAsText(file)
        }

        
    }
    return ( <>
         <div>
             <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>
             Import Your Data (JSON)
                </h2>
                { data && <>
                    <div 
                        className='w-100 grid-flow-row row-text-block'
                        style={{border: '1px solid rgb(70, 70, 80,180)'}}
                        >
                        <div className='w-5/12 p-2 inline-block text-start'>
                        </div> 
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            Total
                        </div>
                    </div>
                    <div 
                        className='w-100 grid-flow-row row-text-block'
                        style={{border: '1px solid rgb(70, 70, 80,180)'}}
                        >
                        <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            Incomes 
                            </div> 
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            {data?.incomes?.length} entries 
                        </div>
                    </div>
                    <div 
                        className='w-100 grid-flow-row row-text-block'
                        style={{border: '1px solid rgb(70, 70, 80,180)'}}
                        >
                        <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            Investments
                            </div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            {data?.investments?.length} entries
                        </div>
                    </div>
                    <div 
                        className='w-100 grid-flow-row row-text-block'
                        style={{border: '1px solid rgb(70, 70, 80,180)'}}
                        >
                            <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                Expenses
                            </div>
                            <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                {data?.expenses?.length} entries
                            </div>
                    </div>
                    <div 
                    className='w-100 grid-flow-row row-text-block'
                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                    >
                        <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            Groceries 
                        </div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            {data?.groceries?.length} entries
                        </div>
                    </div>
                    </>}
                <div className="p-2">
                    <div className="inline-block mr-2 ">
                        <div> Upload file</div>
                        <input type="file" className="text-black" accept='.json' style={{backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '10px'}}
                            onChange={handleOnFileChange}/>
                    </div>
                
                    {!isImported ? <button 
                        className="inline-block bg-blue-500 p-2 w-100 btn-add-item mt-2"
                        style={{borderRadius: '8px'}}
                        disabled={!data}
                        onClick={handleOnImport}>
                            Import Data
                    </button> : <>
                        <h3 style={{color: 'rgb(65, 194, 123)', padding: '10px'}}>Imported your data successfully, window will close automatically</h3>
                    </>}
                </div>
        </div>
    </> );
}

export default Import;