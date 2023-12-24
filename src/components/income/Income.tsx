import { db } from "@/config/database.config";
import {  IncomeItem, InvestmentItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import IncomeItemForm from "./IncomeItemForm";
import { useState } from "react";
import { IncomeService } from "@/service/IncomeService";
import RowActions from "../RowActions";

interface IncomeProps {
    year: number
}
 
function Income(props: IncomeProps){

    const [openForm,setOpenForm] = useState(false);

    const incomes = useLiveQuery(() => db.income.where({year: props.year}).toArray());
    const [selectedItem,setSelectedItem] = useState<number>(-1);

    const is = new IncomeService();

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

    function handleEditIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            is.update( {...selectedItem})
        }
        setOpenForm(false)
    }

    function openFormFn() {
        setOpenForm(true)
        incomes?.forEach((g)=> {
            g.month = '1';
            g.year = 2024
            is.update(g)
        })
    }

    function deleteItem(index: number){
        if(incomes && Number(selectedItem) >= 0 ){
            console.log('deleting', incomes[index])
            is.delete(Number(incomes[index].id))
        return <dialog open>Deleted</dialog>
        }
    }
    return <>
                { openForm ? <IncomeItemForm 
                                handleAddIncomeItem={handleAddIncomeItem}
                                handleEditIncomeItem={handleEditIncomeItem}
                                item={incomes && Number(selectedItem) >= 0 ? incomes[selectedItem-1] : undefined} />
                     :(<button
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
                    return <div className='w-10/12 grid-flow-row row-text-block'
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
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid grey'}}>{income.description}</div>
                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{income.actualAmount}</div>
                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{income.expectedAmount}</div>
                        </div>
                })}
        </>;
}
 
export default Income;