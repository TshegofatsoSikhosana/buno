import { db } from "@/config/database.config";
import {GroceryItem, Store } from "@/model/models";
import { useEffect, useState } from "react";
import GroceryItemForm from "./GroceryItemForm";
import { GroceryService } from "@/service/GroceryService";
import Image from "next/image";
import RowActions from "../shared/RowActions";
import FilterSelector from "../shared/FilterSelector";
import { filterItems } from "@/util/utils";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";
import ExpensesAnalyticsTab from "../expense/tabs/ExpensesAnalyticsTab";
import GroceriesTrackerTab from "./tabs/GroceriesTrackerTab";
import GroceriesAnalyticsTab from "./tabs/GroceriesAnalyticsTab";

interface GroceryProps {
}
 
function Groceries(props: GroceryProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [openForm,setOpenForm] = useState(false);
    const [groceries,setGroceries]  = useState<GroceryItem[]>([]);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredGroceries, setFilteredGroceries] = useState<GroceryItem[]>()
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [analytics, setAnalytics] = useState<boolean>(false);
    
    const gs = new GroceryService();
    
    useEffect(()=>{
        if(groceries){
            const g = filterItems(filterType,groceries)
            setFilteredGroceries([...g])
        }
    },[filterType, groceries]);

    useEffect(()=>{
        getGroceries();
    },[month,year]);
    

    async function getGroceries(){
        db.groceries.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setGroceries([...ex]);
        });
    }



    function dashboardView(){   
        if(analytics){
            return <div className="w-100"> <GroceriesAnalyticsTab/></div>
        }
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
        {!analytics ?
            <GroceriesTrackerTab 
                filteredGroceries={filteredGroceries} 
                getGroceries={getGroceries}
                filterType={filterType} 
                setFilterType={setFilterType}
                /> : 
                <>
                {dashboardView()}
                </>
        }
        </div>;
}
 
export default Groceries;