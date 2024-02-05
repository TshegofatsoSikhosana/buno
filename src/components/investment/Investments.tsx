import { db } from "@/config/database.config";
import {  InvestmentItem } from "@/model/models";
import InvestmentItemForm from "./InvestmentItemForm";
import { useEffect, useState } from "react";
import { InvestmentService } from "@/service/InvestmentService";
import RowActions from "../RowActions";
import FilterSelector from "../FilterSelector";
import { filterItems } from "@/util/utils";
import Image from "next/image";
import closeSvg from '../../assets/close.svg';
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";

interface InvestmentProps {
    setTotalInvestments: (v:number)=> void;
}
 
function Investments(props: InvestmentProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [investments,setInvestments] = useState<InvestmentItem[]>([]);
    const [openForm,setOpenForm] = useState(false);
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredInvestments, setFilteredInvestments] = useState<InvestmentItem[]>()

    const is = new InvestmentService();

    useEffect(()=>{
        if(investments){
            const g = filterItems(filterType,investments)
            setFilteredInvestments([...g])
        }
    },[filterType, investments]);

    useEffect(()=>{
        getInvestments();
    },[month,year]);

    function getInvestments(){
        db.investments.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setInvestments([...ex]);
            props.setTotalInvestments(is.getRemainingInvestments(ex));
        });
    }

    function getActualTotal(){
        return filteredInvestments ? is.getActualTotal(filteredInvestments) : 0
    }

    function getExpectedTotal(){
        return filteredInvestments ? is.getExpectedTotal(filteredInvestments) : 0
    }

    function handleAddIvestmentItem(selectedItem: InvestmentItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = month.toString();
            item.year = year;
            item.dateCreated = Date.now().toString();
            db.investments.add( {...item})
        }
        setOpenForm(false)
        getInvestments();
    }

    function handleEditInvestmentItem(selectedItem: InvestmentItem){
        if(selectedItem){
            is.update( {...selectedItem})
        }
        setOpenForm(false);
        getInvestments();
    }

    function deleteItem(index: number){
        if(filteredInvestments &&     Number(selectedItem) >= 0 ){
            console.log('deleting', filteredInvestments[index])
            is.delete(Number(filteredInvestments[index].id))
            getInvestments();
        }
    }

    return <>
                { openForm ? <>
                                <div className="w-100 " onClick={()=> setOpenForm(false)}>
                                    <Image alt="delete"
                                        src={closeSvg}
                                        height={25} width={25}
                                        className="inline-block"/>
                                    <div className="inline-block text-slate-600 btn-close">CLOSE</div>
                                </div>
                                <InvestmentItemForm
                                    handleAddIvestmentItem={handleAddIvestmentItem} 
                                    handleEditInvestmentItem={handleEditInvestmentItem}
                                    item={investments && Number(selectedItem) >= 0 ? investments[selectedItem-1] : undefined} />
                            </>
                :(<button 
                    className="p-2 mb-2 btn-add"
                    style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                    onClick={(e)=> setOpenForm(true)}>
                        Add Investment
                </button>)
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
                <div className='w-11/12 grid-flow-row ' >
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
                <div className='w-100 grid-flow-row mt-5'>
                    {filteredInvestments?.map((investment, index)=>{
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
                                    <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                        {investment.description}
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{investment.expectedAmount}</div>
                                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{investment.actualAmount}</div>
                            </div>
                    })}
                </div>
        </>;
}
 
export default Investments;