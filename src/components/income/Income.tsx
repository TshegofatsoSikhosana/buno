import { db } from "@/config/database.config";
import {  IncomeItem } from "@/model/models";
import IncomeItemForm from "./IncomeItemForm";
import { useEffect, useState } from "react";
import { IncomeService } from "@/service/IncomeService";
import RowActions from "../RowActions";
import FilterSelector from "../FilterSelector";
import { filterItems } from "@/util/utils";
import Image from "next/image";
import closeSvg from '../../assets/close.svg';
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";

interface IncomeProps {
    setTotalIncomes: (v:number)=> void;
}
 
function Income(props: IncomeProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
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
    },[month,year]);

    function getIncomes(){
        db.income.where({year: year})
        .and((i)=> Number(i.month) == month)
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

    function deleteItem(index: number){
        if(filteredIncomes && Number(selectedItem) >= 0 ){
            console.log('deleting', filteredIncomes[index])
            is.delete(Number(filteredIncomes[index].id))
            getIncomes();
        }
    }

    function close(v:boolean){
        setOpenForm(v);
        setSelectedItem(-1);
    }
    
    return <div className="dashboard-container">
                <button
                        className="p-2 mb-2 btn-add"
                        style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                        onClick={(e)=> setOpenForm(true)}>
                            Add Income
                </button>
                { openForm &&
                        <IncomeItemForm 
                            open={openForm}
                            setOpen={close}
                            refresh={getIncomes}
                            item={incomes && Number(selectedItem) >= 0 ? incomes[selectedItem-1] : undefined} />
                }
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
        </div>;
}
 
export default Income;