import { db } from "@/config/database.config";
import { ExpenseItem } from "@/model/models";
import { useEffect, useState } from "react";
import { ExpenseService } from "@/service/ExpenseService";
import { filterItems,getPercentageSpent } from "@/util/utils";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";
import ExpsenseBarChart from "./dashboard-charts/ExpensesBarChart";
import ExpenseTracker from "./ExpenseTracker";

interface ExpensesProps {
    setTotalExpenses: (v:number)=> void;
}
 
function Expenses(props: ExpensesProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [expenses,setExpenses] = useState<ExpenseItem[]>([]);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>();
    const [percentageComplete, setPercentageComplete] = useState<number>(0);
    const [analytics, setAnalytics] = useState<boolean>(false);
    const es = new ExpenseService();


    useEffect(()=>{
        if(expenses){
                const e = filterItems(filterType, expenses);
                setFilteredExpenses([...e]);
                props.setTotalExpenses(es.getRemainingExpenses(expenses));
                setPercentageComplete(getPercentageSpent(expenses));
       
            }
    },[filterType, expenses]);

    useEffect(()=>{
        getExpenses();
    },[month,year]);

    function getExpenses(){
        db.expenses.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setExpenses([...ex]);
            props.setTotalExpenses(es.getRemainingExpenses(ex));
        });
    }


    function dashboardView(){   
        if(analytics){
            return <div className="w-100"> <ExpsenseBarChart/></div>
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
                <ExpenseTracker 
                    expenses={expenses} 
                    filteredExpenses={filteredExpenses} 
                    percentageComplete={percentageComplete} 
                    getExpenses={getExpenses} 
                    filterType={filterType} 
                    setFilterType={setFilterType}/> :
                <>
                {dashboardView()}
                </>
            }
        </div>;
}
 
export default Expenses;