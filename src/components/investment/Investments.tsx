import { db } from "@/config/database.config";
import { ExpenseCategory, ExpenseItem, InvestmentItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import InvestmentItemForm from "./InvestmentItemForm";
import { useState } from "react";
import { InvestmentService } from "@/service/InvestmentService";
import RowActions from "../RowActions";

interface InvestmentProps {
    year: number
}
 
function Investments(props: InvestmentProps){

    const investments = useLiveQuery(() => db.investments.where({year: props.year}).toArray());
    const [openForm,setOpenForm] = useState(false);
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    
    const is = new InvestmentService();

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

    function handleEditInvestmentItem(selectedItem: InvestmentItem){
        if(selectedItem){
            is.update( {...selectedItem})
        }
        setOpenForm(false)
    }

    function deleteItem(index: number){
        if(investments &&     Number(selectedItem) >= 0 ){
            console.log('deleting', investments[index])
            is.delete(Number(investments[index].id))
        return <dialog open>Deleted</dialog>
        }
    }

    return <>
                { openForm ? <InvestmentItemForm
                                handleAddIvestmentItem={handleAddIvestmentItem} 
                                handleEditInvestmentItem={handleEditInvestmentItem}
                                item={investments && Number(selectedItem) >= 0 ? investments[selectedItem-1] : undefined} />
                :(<button 
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
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid grey'}}>
                                    {expense.description}
                                </div>
                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.actualAmount}</div>
                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid grey'}}> R{expense.expectedAmount}</div>
                        </div>
                })}
        </>;
}
 
export default Investments;