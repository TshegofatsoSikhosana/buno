import { ExpenseCategory, ExpenseItem, GroceryItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetActions, budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from '../../shared/charts/BarChart';
import { getItemsInOrder, months } from '@/util/utils';
import { useAppDispatch } from '@/store/hooks';
import ExpenseLineBarPanel from '@/components/expense/dashboard-charts/ExpenseLineBarPanel';
import ExpensesLineChartPanel from '@/components/expense/dashboard-charts/ExpensesLineChartPanel';
import GroceriesLineBarPanel from '../dashboard-charts/GroceriesLineBarPanel';
import GroceriesLineChartPanel from '../dashboard-charts/GroceriesLineChartPanel';

const GroceriesAnalyticsTab = () => {
    const [groceries,setGroceries] = useState<GroceryItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [filterType,setFilterType] = useState<string>();
    const [filteredGroceries, setFilteredGroceries] = useState<GroceryItem[]>()
    const [isTotalsView,setIsTotalsView] = useState(false);
    const dispatch = useAppDispatch();
    const [expenseItemNames, setExpenseItemNames] = useState<string[]>([]);

    useEffect(()=>{
        getGroceries();
    },[year,month]);
    
    useEffect(()=>{
      if(filterType){
        setFilteredGroceries(groceries.filter((e)=> e.description.toLowerCase().trim() === filterType));
      }else{
        
        setFilteredGroceries(groceries)
      }
  },[filterType,groceries]);

    function getGroceries(){
      db.groceries
      .toArray()
      .then((ex)=> {
          // setGroceries(ex.filter((e)=> e.description.toLowerCase() !== "groceries")
          const monthSet = new Set<string>();
          const items = ex.sort((a,b) => a.description.toLowerCase().trim().localeCompare(b.description.toLowerCase().trim()));
       
          
          let itemsSet = new Set<string>();
          if(expenseItemNames){
              itemsSet = new Set(expenseItemNames);
          }

          ex.forEach((e)=> {
            itemsSet.add(e.description.toLowerCase().trim())
          })

          setExpenseItemNames(Array.from(itemsSet));
             setGroceries(items);
          setFilteredGroceries(items);
      });
    }

    function updateYear(year:number){
      dispatch(budgetActions.setCurrentYear(year))
    }
  
    function updateMonth(month:number){
      if(month > 0 && month <= 12){
        dispatch(budgetActions.setCurrentMonth(month))
      }
    }
  
    

    return (
      <>
          
      {filteredGroceries && 
 
          <> 
          <div>
           
              <div className="inline  w-4/12 p-2">
                  {/* <button
                    className="p-2 mb-2 mr-2 btn-add"
                    onClick={(e)=> setIsTotalsView(!isTotalsView)}>
                      {isTotalsView ? "Show Current Budget" : "Show Totals"}
                </button> */}

                <select className="text-white p-2"
                        style={{borderRadius: '5px', backgroundColor: 'rgb(70, 70, 80,180)'}}
                        value={filterType}
                        onChange={(e)=> setFilterType(e.target.value.trim())}>
                    <option value={''}>All {expenseItemNames.length || 0} Items</option>
                    {expenseItemNames?.map((name, i)=>{
                        return <><option value={name} key={i}>{name}</option></>
                    })}
                </select>
              </div>
            <div className="inline w-3/12 p-2"></div>
            </div>
            <div className="w-10/12 inline-block mt-5">
              <div className='w-100'>
                <GroceriesLineChartPanel filteredGroceries={filteredGroceries}/>
              {/* <BarChart labels ={filteredExpenses.map((g)=> g.description)} 
                  data={filteredExpenses.map((g)=> g.actualAmount)}
                  title="Current Budget Expenses"/> */}
              </div>
            </div>
       
            {/* <div className=' w-100 bg-white text-black p-5 text-left mb-5' style={{borderRadius: '10px', fontWeight: 700, marginTop: '69px'}}> 
              <div  className='inline-block w-6/12' >Month-to-Month Overview</div>
            </div>
            <div className="w-11/12 text-white inline-block">

            <div className='text-white inline-block w-11/12'>
                  <ExpenseLineBarPanel nameFilterType={filterType as string}></ExpenseLineBarPanel>
            </div> */}
            
                {/* <ExpsenseDoughnut /> */}
              
            {/* </div> */}
      
          </>
      }
      </>
    );
}

export default GroceriesAnalyticsTab;
