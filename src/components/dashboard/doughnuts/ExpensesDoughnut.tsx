import { ExpenseCategory, ExpenseItem } from '@/model/models';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import DoughnutChart from './DoughnutChart';


const ExpsenseDoughnut = () => {
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
        {expenses && <DoughnutChart values={expenses.filter((item) => item.actualAmount > 0).map(expense => expense.actualAmount)}
              colors={expenses.map(expense =>  `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`)} 
              labels={expenses.map(expense => expense.description)}/>

      }
      </>
    );
}

export default ExpsenseDoughnut;
