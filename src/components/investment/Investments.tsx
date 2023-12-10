import { db } from "@/config/database.config";
import { ExpenseCategory, ExpenseItem, InvestmentItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import InvestmentItemForm from "./InvestmentItemForm";
import { useState } from "react";

interface ExpensesProps {
    
}
 
function Investments(){

    const investments = useLiveQuery(() => db.investments.toArray());
    const [openForm,setOpenForm] = useState(false);

    const investment: InvestmentItem[] = [
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

    function getActualTotal(){
        let amt:number = 0;
        if(investments){
            for (let index = 0; index < investments.length; index++) {
                const e = investments[index];
                amt += Number(e.actualAmount);
            }
        }
      
        return amt
    }


    function getExpectedTotal(){
        let amt:number = 0;
        if(investments){
            for (let index = 0; index < investments.length; index++) {
                const e = investments[index];
                amt += Number(e.expectedAmount);
            }
        }
      
        return amt
    }
    function handleAddIvestmentItem(selectedItem: InvestmentItem){

        if(selectedItem){
            db.investments.add( {...selectedItem})
        }

        setOpenForm(false)
    }
    return <>
                { openForm ? <InvestmentItemForm handleAddIvestmentItem={handleAddIvestmentItem} />:( 
                 <button 
                    className="p-2 mb-2 btn-add"
                    style={{borderRadius: '8px', border:'2px solid grey'}}
                    onClick={(e)=> setOpenForm(true)}>
                        Add Investment
                </button>)
                }
                <div className='w-10/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' ></div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid grey'}} >
                        Actual
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid grey'}} >
                        Expected
                    </div>
                </div>
                <div className='w-10/12 grid-flow-row ' style={{border: '1px solid grey'}}>
                    <div className='w-6/12 p-2 inline-block' >Investments</div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{borderLeft: '2px solid grey', color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal()}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{borderLeft: '2px solid grey', color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal()}
                    </div>
                </div>
                {investments?.map((expense, index)=>{
                    return <div className='w-10/12 grid-flow-row' style={{border: '1px solid grey'}} key={index}>
                                <div className='w-3/12 inline-block'></div>
                                <div className='w-3/12 p-2 inline-block' style={{borderLeft: '2px solid grey'}}>{expense.description}</div>
                        <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.actualAmount}</div>
                        <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.expectedAmount}</div>
                </div>
                })}
        </>;
}
 
export default Investments;