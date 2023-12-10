'use client'
import Expenses from '@/components/expense/Expenses'
import Groceries from '@/components/groceries/Groceries';
import Income from '@/components/income/Income';
import Investments from '@/components/investment/Investments';
import { db } from '@/config/database.config';
import { ExpenseCategory } from '@/model/models';
import { useLiveQuery } from 'dexie-react-hooks';
import Image from 'next/image'
import { useState } from 'react'



enum Tab{
  EXPENSES,
  INVESTMENTS,
  INCOME,
  GROCERIES
}
export default function Home() {

  const expenses = useLiveQuery(() => db.expenses.toArray());
  const investments = useLiveQuery(() => db.investments.toArray());
  const incomes = useLiveQuery(() => db.income.toArray());

  const [active, setActive] = useState<Tab>(Tab.EXPENSES);

  function isTabActive(type: Tab){
    return type == active ? 'active-section' : ''
  }

  function renderContent(){
    switch (active) {
      case Tab.INVESTMENTS:
        return <Investments/>
      case Tab.INCOME:
        return <Income/>
      case Tab.GROCERIES:
        return <Groceries/>
      default:
        return <Expenses/>
    }
  }

  function getExpensesTotal(){
    let amt:number = 0;
    if(expenses){
        for (let index = 0; index < expenses.length; index++) {
            const e = expenses[index];
            amt += Number(e.actualAmount);
        }
    }
    return amt
  }

  function getIncomesTotal(){
    let amt:number = 0;
    if(incomes){
        for (let index = 0; index < incomes.length; index++) {
            const e = incomes[index];
            amt += Number(e.actualAmount);
        }
    }
    return amt
  }

  function getInvestmentsTotal(){
    let amt:number = 0;
    if(investments){
        for (let index = 0; index < investments.length; index++) {
            const e = investments[index];
            amt += Number(e.expectedAmount);
        }
    }
    return amt
  }
  return (
    <main className=" p-24 w-100">
        <h2 className='font-bold text-stone-100 text-center' style={{fontSize: '36px'}}>2023 December Budget</h2>
        <div className='w-100 p-5'>
          <div className='inline-block mr-5 w-60' style={{border:'2px solid rgb(30,150,222,80)', padding:'1rem',borderRadius:'10px' }}>
            <h1>Total Expenses</h1>
            <div>R{getExpensesTotal()}</div>
          </div>

          <div className='inline-block w-60 mr-5' style={{border:'2px solid rgb(30,150,222,80)', padding:'1rem',borderRadius:'10px' }}>
            <div>Total Investments</div>
            <div>R{getInvestmentsTotal()}</div>
          </div>

          <div  className='inline-block mr-5 w-60' style={{border:'2px solid rgb(30,150,222,80)', padding:'1rem',borderRadius:'10px' }}>
            <div>Total Income</div>
            <div>R{getIncomesTotal()}</div>
          </div>


          <div  className='inline-block mr-5 w-60 text-center btn-add' style={{border:'2px solid rgb(30,150,222,80)', padding:'1rem',borderRadius:'10px' }}>
            <div>Clone</div>
            <div>Bugdet</div>
          </div>
         
        </div>
        <div className='w-100'>
          <div 
           className={`inline-block p-4 ${isTabActive(Tab.EXPENSES)}`}
           onClick={(e)=> setActive(Tab.EXPENSES)}
           > 
              Expenses
          </div>
          <div 
           className={`inline-block p-4 ${isTabActive(Tab.GROCERIES)}`}
           onClick={(e)=> setActive(Tab.GROCERIES)}
           > 
              Groceries
          </div>
          <div 
            className={`inline-block p-4 ${isTabActive(Tab.INVESTMENTS)}`}
            onClick={(e)=> setActive(Tab.INVESTMENTS)}
           >
              Investments
          </div>
          <div 
            className={`inline-block p-4 ${isTabActive(Tab.INCOME)}`}
            onClick={(e)=> setActive(Tab.INCOME)}
           >
              Income
          </div>
        </div>
        <div className='content border-white w-100 h-100 p-4'>
          {renderContent()}
        </div>
    </main>
  )
}
