import { IncomeItem, InvestmentItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';
import IncomesLineBarPanel from '../line-chart-panel/IncomesLineBarPanel';

const IncomesBarChart = () => {
    const [incomes,setIncomes] = useState<IncomeItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [isTotalsView,setIsTotalsView] = useState(false);

    useEffect(()=>{
        getInvestments();
    },[year,month]);
    
      function getInvestments(){
        db.income.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setIncomes(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
        });
      }
    return (
      <>
      <div>
              <div className="inline  w-4/12 p-2">
                  <button
                    className="p-2 mb-2 mr-2 btn-add"
                    style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                    onClick={(e)=> setIsTotalsView(!isTotalsView)}>
                       { isTotalsView ? "Show Current budget" : "Show Totals"}
                </button>
              </div>
              <div className="inline w-4/12 p-2">
              </div>
          </div>
        {incomes && 
        <> 
            {!isTotalsView ? 
            <BarChart
              labels ={incomes.map((g)=> g.description)}
              data={incomes.map((g)=> g.actualAmount)}
              title="Current Budget Investments"/>
              : <div className='text-white inline-block' style={{width: '100%'}}>
                <IncomesLineBarPanel/>
                </div>
            }</>
        }
      </>
    );
}

export default IncomesBarChart;
