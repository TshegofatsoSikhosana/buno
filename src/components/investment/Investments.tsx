import { db } from "@/config/database.config";
import {  InvestmentItem } from "@/model/models";
import InvestmentItemForm from "./InvestmentItemForm";
import { useEffect, useState } from "react";
import { InvestmentService } from "@/service/InvestmentService";
import RowActions from "../shared/RowActions";
import FilterSelector from "../shared/FilterSelector";
import { filterItems, getPercentageSpent } from "@/util/utils";
import Image from "next/image";
import closeSvg from '../../assets/close.svg';
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";
import ProgressBar from "../shared/ProgressBar";
import InvestmentTrackingTab from "./tabs/InvestmentsTrackerTab";
import InvestmentAnalyticsTab from "./tabs/InvestmentsAnalyticsTab";

interface InvestmentProps {
    setTotalInvestments: (v:number)=> void;
}
 
function Investments(props: InvestmentProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [investments,setInvestments] = useState<InvestmentItem[]>([]);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredInvestments, setFilteredInvestments] = useState<InvestmentItem[]>()
    const [percentageComplete, setPercentageComplete] = useState<number>(0);
    const [analytics, setAnalytics] = useState<boolean>(false);

    const is = new InvestmentService();

    useEffect(()=>{
        if(investments){
            const g = filterItems(filterType,investments)
            setFilteredInvestments([...g]);
            setPercentageComplete(getPercentageSpent(investments));
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

    return <div className="dashboard-container">
         <div className='w-100 grid-flow-row  ' style={{borderTopLeftRadius: '10px',  borderTopRightRadius: '10px'}}> 
            <div className={`w-1/12 p-3 inline-block ${!analytics ? 'active-tab' : 'category-tab-option '} text-center`} 
             onClick={(e)=> setAnalytics(false)}>
                Tracker
            </div>
             <div className={`w-1/12 p-3 inline-block ${analytics ? 'active-tab' : 'category-tab-option'} text-center`} 
             onClick={(e)=> setAnalytics(true)}>
                Analytics
            </div>
        </div>
            <div style={{background: ' rgb(30,150,222,0.5)', padding: '2px', marginBottom: '1rem'}}></div>

                {!analytics ? <InvestmentTrackingTab
                    filterType={filterType}
                    getInvestments={getInvestments}
                    investments={investments}
                    filteredInvestments={filteredInvestments}
                    percentageComplete={percentageComplete}
                    setFilterType={setFilterType}
                /> : <InvestmentAnalyticsTab />}
        </div>;
}
 
export default Investments;