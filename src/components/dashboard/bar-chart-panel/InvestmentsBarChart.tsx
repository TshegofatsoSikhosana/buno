import { InvestmentItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';
import InvestemetsLineBarPanel from '../line-chart-panel/InvestmentsLineBarPanel';

const InvestmentsBarChart = () => {
    const [investments,setInvestements] = useState<InvestmentItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [isTotalsView,setIsTotalsView] = useState(false);

    useEffect(()=>{
        getInvestments();
    },[year,month]);
    
      function getInvestments(){
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
        {investments && 
        <> 
            {!isTotalsView ? 
            <BarChart
              labels ={investments.map((g)=> g.description)}
              data={investments.map((g)=> g.actualAmount)}
              title="Current Budget Investments"/>
              : <div className='text-white inline-block' style={{width: '100%'}}>
                <InvestemetsLineBarPanel/>
                </div>
            }</>
        }
      </>
    );
}

export default InvestmentsBarChart;
