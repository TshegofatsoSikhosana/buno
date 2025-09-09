import { ExpenseItem, GroceryItem, Store } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';
import DatePicker from './DatePicker';
import GroceriesLineBarPanel from '../line-chart-panel/GroceriesLineBarPanel';

const GroceriesBarChart = () => {
    const [groceries,setGroceries] = useState<GroceryItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [isTotalsView,setIsTotalsView] = useState(false);
    const [filterType,setFilterType] = useState<Store | undefined>();
    

    useEffect(()=>{
        getGroceries();
    },[year,month]);
    
      function getGroceries(){
        db.groceries.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setGroceries(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
        });
      }
    return (
      <>
       <div>
              {/* <div className="inline  w-4/12 p-2">
                <select className="text-white p-2"
                        style={{borderRadius: '5px', backgroundColor: 'rgb(70, 70, 80,180)'}}
                        value={filterType}
                        onChange={(e)=> setFilterType(Number(e.target.value))}>
                    <option value={undefined}>No Category</option>
                    <option value={ExpenseCategory.EXCEPTION}>Exception</option>
                    <option value={ExpenseCategory.LIVING}>Living</option>
                    <option value={ExpenseCategory.PERSONAL}>Personal</option>
                </select> 
              </div> */}
              <div className="inline  w-4/12 p-2">
                  <button
                    className="p-2 mb-2 mr-2 btn-add"
                    style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                    onClick={(e)=> setIsTotalsView(true)}>
                        Show Totals
                </button>
              </div>
              <div className="inline w-4/12 p-2">
                {/* <DatePicker/> */}
              </div>
          </div>
        { groceries && 
        <> 
            {!isTotalsView ? 
          <BarChart 
            labels ={groceries.map((g)=> g.description)}
            data={groceries.map((g)=> g.actualAmount)}
            title="Current Budget Groceries"/>
         :  <div className='text-white inline-block' style={{width: '100%'}}>
                <GroceriesLineBarPanel filterType={filterType}/>
                </div>
            }</>
         }
      </>
    );
}

export default GroceriesBarChart;
