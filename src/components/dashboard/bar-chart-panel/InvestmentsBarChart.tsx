import { InvestmentItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';
import DatePicker from './DatePicker';

const InvestmentsBarChart = () => {
    const [investments,setInvestements] = useState<InvestmentItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    useEffect(()=>{
        getGroceries();
    },[year,month]);
    
      function getGroceries(){
        db.investments.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setInvestements(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
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
              <div className="inline w-4/12 p-2">
                <DatePicker/>
              </div>
          </div>
        {investments && 
            <BarChart
              labels ={investments.map((g)=> g.description)}
              data={investments.map((g)=> g.actualAmount)}
              title="Current Budget Investments"/>
        }
      </>
    );
}

export default InvestmentsBarChart;
