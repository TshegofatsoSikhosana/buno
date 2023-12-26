import { db } from "@/config/database.config";
import {  IncomeItem, InvestmentItem } from "@/model/models";
import { useLiveQuery } from "dexie-react-hooks";
import IncomeItemForm from "./IncomeItemForm";
import { useEffect, useState } from "react";
import { IncomeService } from "@/service/IncomeService";
import RowActions from "../RowActions";
import FilterSelector from "../FilterSelector";
import { filterItems } from "@/app/util/utils";

interface IncomeProps {
    year: number
}
 
function Income(props: IncomeProps){

    const [openForm,setOpenForm] = useState(false);

    const incomes = useLiveQuery(() => db.income.where({year: props.year}).toArray());
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredIncomes, setFilteredGroceries] = useState<IncomeItem[]>()

    const is = new IncomeService();

    useEffect(()=>{
        if(incomes){
            const g = filterItems(filterType,incomes)
            setFilteredGroceries([...g])
        }
    },[filterType, incomes])

    function getActualTotal(){
        return filteredIncomes ? is.getActualTotal(filteredIncomes) : 0
    }

    function getExpectedTotal(){
        return filteredIncomes ? is.getExpectedTotal(filteredIncomes) : 0
    }


    function handleAddIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            db.income.add( {...selectedItem})
        }
        setOpenForm(false)
    }

    function handleEditIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            selectedItem.year = 2024
            selectedItem.dateCreated =  Date.now().toString()
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
        if(filteredIncomes && Number(selectedItem) >= 0 ){
            console.log('deleting', filteredIncomes[index])
            is.delete(Number(filteredIncomes[index].id))
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
                        style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                        onClick={(e)=> setOpenForm(true)}>Add Income Item</button>
                )}
                  <div className='w-11/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' ></div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Expected
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Actual
                    </div>
                </div>
                <div className='w-11/12 grid-flow-row '>
                    <div className='w-6/12 text-start grid-flow-row inline-block'> 
                        <FilterSelector filterType={filterType} setFilterType={setFilterType}/>
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                        R{getExpectedTotal()}
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                        R{getActualTotal()}
                    </div>
                </div>
                <div className='w-100 grid-flow-row mt-5 ' >
                    {filteredIncomes?.map((income, index)=>{
                        return <div className='w-11/12 grid-flow-row row-text-block'
                                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                    key={index}
                                    onClick={(e)=> setSelectedItem(index+1)}
                                    onMouseLeave={(e)=> setSelectedItem(-1)}>
                                    <div className='w-1/12 inline-block text-center' > 
                                    {Number(selectedItem) - 1 === index ? 
                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                        : <></>
                                    }
                                    </div>
                                    <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{income.description}</div>
                                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{income.expectedAmount}</div>
                                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{income.actualAmount}</div>
                            </div>
                    })}
                </div>
        </>;
}
 
export default Income;