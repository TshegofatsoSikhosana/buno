import { ExpenseItem, GroceryItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';

const ExpsenseBarChart = () => {
    const [groceries,setGroceries] = useState<ExpenseItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    useEffect(()=>{
        getGroceries();
    },[year,month]);
    
      function getGroceries(){
        db.expenses.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            // setGroceries(ex.filter((e)=> e.description.toLowerCase() !== "groceries")
            setGroceries(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
        });
      }
    return (
      <BarChart labels ={groceries.map((g)=> g.description)} data={groceries.map((g)=> g.actualAmount)} title="Expenses Budget"/>
    );
}

export default ExpsenseBarChart;
