import {  GroceryItem } from '@/model/models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import DoughnutChart from './DoughnutChart';


const GroceriesDoughnut = () => {
  const [groceries,setGroceries] = useState<GroceryItem[]>([]);
  const year= useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);

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
        {groceries && <DoughnutChart values={groceries.filter((item) => item.actualAmount > 0).map(grocerie => grocerie.actualAmount)}
              colors={groceries.map(grocerie =>  `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`)} 
              labels={groceries.map(grocerie => grocerie.description)}/>

      }
      </>
    );
}

export default GroceriesDoughnut;
