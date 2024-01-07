import { db } from "@/config/database.config";
import {  IncomeItem } from "@/model/models";
import IncomeItemForm from "./IncomeItemForm";
import { useEffect, useState } from "react";
import { IncomeService } from "@/service/IncomeService";
import RowActions from "../RowActions";
import FilterSelector from "../FilterSelector";
import { filterItems } from "@/app/util/utils";
import Image from "next/image";
import closeSvg from '../../assets/close.svg';
import { useAppContext } from "@/context/Context";

interface IncomeProps {
    setTotalIncomes: (v:number)=> void;
}
 
function Income(props: IncomeProps){
    // @ts-ignore:next-line
    const {state} = useAppContext();
    const [openForm,setOpenForm] = useState(false);

    const [incomes,setIncomes] = useState<IncomeItem[]>([]);
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredIncomes, setFilteredGroceries] = useState<IncomeItem[]>()

    const is = new IncomeService();

    useEffect(()=>{
        if(incomes){
            const g = filterItems(filterType,incomes)
            setFilteredGroceries([...g])
        }
    },[filterType, incomes]);

    useEffect(()=>{
        getIncomes();
    },[state.month,state.year]);

    function getIncomes(){
        db.income.where({year: state.year})
        .and((i)=> Number(i.month) == state.month)
        .toArray()
        .then((ex)=> {
            setIncomes([...ex]);
            props.setTotalIncomes(is.getRemainingIncome(ex));

        });
    }

    function getActualTotal(){
        return filteredIncomes ? is.getActualTotal(filteredIncomes) : 0
    }

    function getExpectedTotal(){
        return filteredIncomes ? is.getExpectedTotal(filteredIncomes) : 0
    }


    function handleAddIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = state.month.toString();
            item.year = state.year;
            item.dateCreated = Date.now().toString();
            db.income.add( {...item})
        }
        setOpenForm(false);
        getIncomes();
    }

    function handleEditIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            selectedItem.year = 2024
            selectedItem.dateCreated =  Date.now().toString()
            is.update( {...selectedItem})
        }
        setOpenForm(false);
        getIncomes();
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
            getIncomes();
        }
    }


    return <>
                { openForm ? <>
                                <div className="w-100 " onClick={()=> setOpenForm(false)}>
                                    <Image alt="delete"
                                        src={closeSvg}
                                        height={25} width={25}
                                        className="inline-block"/>
                                    <div className="inline-block text-slate-600 btn-close">Close</div>
                                </div>
                                <IncomeItemForm 
                                    handleAddIncomeItem={handleAddIncomeItem}
                                    handleEditIncomeItem={handleEditIncomeItem}
                                    item={incomes && Number(selectedItem) >= 0 ? incomes[selectedItem-1] : undefined} />
                            </>
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