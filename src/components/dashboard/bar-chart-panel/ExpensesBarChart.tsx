import { ExpenseCategory, ExpenseItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetActions, budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from './BarChart';
import { months } from '@/util/utils';
import { useAppDispatch } from '@/store/hooks';
import Image from 'next/image';
import closeSvg from '../../../assets/close.svg'
import DatePicker from './DatePicker';

const ExpsenseBarChart = () => {
    const [expenses,setExpenses] = useState<ExpenseItem[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [filterType,setFilterType] = useState<ExpenseCategory | undefined>();
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>()
    const [openForm,setOpenForm] = useState(false);
    const dispatch = useAppDispatch();

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

    function updateYear(year:number){
      dispatch(budgetActions.setCurrentYear(year))
    }
  
    function updateMonth(month:number){
      if(month > 0 && month <= 12){
        dispatch(budgetActions.setCurrentMonth(month))
      }
    }
  

    return (
      <>
          <div>
              <div className="inline  w-4/12 p-2">
                <select className="text-white p-2"
                        style={{borderRadius: '5px', backgroundColor: 'rgb(70, 70, 80,180)'}}
                        value={filterType}
                        onChange={(e)=> setFilterType(Number(e.target.value))}>
                    <option value={undefined}>No Category</option>
                    <option value={ExpenseCategory.EXCEPTION}>Exception</option>
                    <option value={ExpenseCategory.LIVING}>Living</option>
                    <option value={ExpenseCategory.PERSONAL}>Personal</option>
                </select> 
              </div>
              <div className="inline w-4/12 p-2">
                {/* <DatePicker/> */}
              </div>
          </div>
      {filteredExpenses && 
        <div className="w-11/12 text-white inline-block">
          <BarChart labels ={filteredExpenses.map((g)=> g.description)} 
                data={filteredExpenses.map((g)=> g.actualAmount)}
                title="Current Budget Expenses"/>
        </div>
      }
      </>
    );
}

export default ExpsenseBarChart;
