import { InvestmentItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';

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
      <BarChart labels ={investments.map((g)=> g.description)} data={investments.map((g)=> g.actualAmount)} title="Current Budget Investments"/>
    );
}

export default InvestmentsBarChart;
