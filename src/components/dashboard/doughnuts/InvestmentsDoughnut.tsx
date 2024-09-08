import {   InvestmentItem } from '@/model/models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import DoughnutChart from './DoughnutChart';


const InvestmentsDoughnut = () => {
  const [investments,setInvestments] = useState<InvestmentItem[]>([]);
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
          setInvestments(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
      });
    }

    return (
      <>
        {investments && <DoughnutChart values={investments.filter((item) => item.actualAmount > 0).map(grocerie => grocerie.actualAmount)}
              colors={investments.map(grocerie =>  `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`)} 
              labels={investments.map(grocerie => grocerie.description)}/>

      }
      </>
    );
}

export default InvestmentsDoughnut;
