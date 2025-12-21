import {   IncomeItem, InvestmentItem } from '@/model/models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import DoughnutChart from './DoughnutChart';


const IncomesDoughnut = () => {
  const [incomes,setIncomes] = useState<IncomeItem[]>([]);
  const year= useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);

  useEffect(()=>{
      getIncomes();
  },[year,month]);
  
    function getIncomes(){
      db.income.where({year: year})
      .and((i)=> Number(i.month) == month)
      .toArray()
      .then((ex)=> {
          setIncomes(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
      });
    }

    return (
      <>
        {incomes && <DoughnutChart values={incomes.filter((item) => item.actualAmount > 0).map(grocerie => grocerie.actualAmount)}
              colors={incomes.map(grocerie =>  `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`)} 
              labels={incomes.map(grocerie => grocerie.description)}/>

      }
      </>
    );
}

export default IncomesDoughnut;
