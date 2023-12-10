import { db } from "@/config/database.config";
import {  IncomeItem, InvestmentItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import IncomeItemForm from "./IncomeItemForm";
import { useState } from "react";

interface ExpensesProps {
    
}
 
function Income(){

  const [openForm,setOpenForm] = useState(false);

  const incomes = useLiveQuery(() => db.income.toArray());

    const income: InvestmentItem[] = [
        {
            description: 'Psybergate',
            expectedAmount: 26360,
            actualAmount: 26360,
            bank: 'absa',
            month: 'NOVEMBER',
            dateCreated: Date.now().toString(),
            year: 2023
        },
        
      
    ]

    function getActualTotal(){
        let amt:number = 0;
        if(incomes){
            for (let index = 0; index < incomes.length; index++) {
                const e = incomes[index];
                amt += Number(e.actualAmount);
            }
        }
        return amt
    }

    function getExpectedTotal(){
        let amt:number = 0;
        if(incomes){
            for (let index = 0; index < incomes.length; index++) {
                const e = incomes[index];
                amt += Number(e.actualAmount);
            }
        }
        return amt
    }


    function handleAddIncomeItem(selectedItem: IncomeItem){

        if(selectedItem){
            db.income.add( {...selectedItem})
        }
        setOpenForm(false)
    }
    return <>
                { openForm ? <IncomeItemForm handleAddIncomeItem={handleAddIncomeItem} />:( 
                    <button
                        className="p-2 mb-2 btn-add"
                        style={{borderRadius: '8px', border:'2px solid grey'}}
                        onClick={(e)=> setOpenForm(true)}>Add Income Item</button>
                )}
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
                {incomes?.map((income, index)=>{
                    return <div className='w-10/12 grid-flow-row' style={{border: '1px solid grey'}} key={index}>
                                <div className='w-3/12 inline-block'></div>
                                <div className='w-3/12 p-2 inline-block' style={{borderLeft: '2px solid grey'}}>{income.description}</div>
                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{income.actualAmount}</div>
                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{income.expectedAmount}</div>
                        </div>
                })}
        </>;
}
 
export default Income;