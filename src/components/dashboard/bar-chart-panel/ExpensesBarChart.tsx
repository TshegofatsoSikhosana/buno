import { ExpenseCategory, ExpenseItem, GroceryItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';

const ExpsenseBarChart = () => {
    const [expenses,setExpenses] = useState<ExpenseItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [filterType,setFilterType] = useState<ExpenseCategory | undefined>();
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>()

    useEffect(()=>{
        getExpenses();
    },[year,month]);
    
    useEffect(()=>{
      if(filterType || filterType === 0){
        setFilteredExpenses(expenses.filter((e)=> e.category === filterType));
      }else{
        // if()
        console.log('filter:',filterType);
        
        setFilteredExpenses(expenses)
      }
  },[filterType,expenses]);

    function getExpenses(){
      db.expenses.where({year: year})
      .and((i)=> Number(i.month) == month)
      .toArray()
      .then((ex)=> {
          // setGroceries(ex.filter((e)=> e.description.toLowerCase() !== "groceries")
          setExpenses(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
          setFilteredExpenses(ex.sort((a,b)=> b.actualAmount - a.actualAmount));
      });
    }

    return (
      <>
       <select className="text-white p-2"
                    style={{borderRadius: '5px', backgroundColor: 'rgb(70, 70, 80,180)'}}
                    value={filterType}
                    onChange={(e)=> setFilterType(Number(e.target.value))}>
                <option value={undefined}>No Category</option>
                <option value={ExpenseCategory.EXCEPTION}>Exception</option>
                <option value={ExpenseCategory.LIVING}>Living</option>
                <option value={ExpenseCategory.PERSONAL}>Personal</option>
            </select> 
      {filteredExpenses && 
        <BarChart labels ={filteredExpenses.map((g)=> g.description)} 
              data={filteredExpenses.map((g)=> g.actualAmount)}
              title="Current Budget Expenses"/>
      }
      </>
    );
}

export default ExpsenseBarChart;
