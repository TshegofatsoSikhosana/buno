'use client'
import Calendar from '@/components/Calendar';
import Expenses from '@/components/expense/Expenses'
import Groceries from '@/components/groceries/Groceries';
import Income from '@/components/income/Income';
import Investments from '@/components/investment/Investments';
import { db } from '@/config/database.config';
import { useLiveQuery } from 'dexie-react-hooks';
import Image from 'next/image';
import { useState } from 'react';
import settingsSvg from '../assets/settings.svg'
import { DatePicker } from 'react-responsive-datepicker';
import 'react-responsive-datepicker/dist/index.css'


enum Tab{
  EXPENSES,
  INVESTMENTS,
  INCOME,
  GROCERIES
}
export default function Home() {

  const [year, setYear] = useState<number>(2024)
  const expenses = useLiveQuery(() => db.expenses.where({year: year}).toArray());
  const investments = useLiveQuery(() => db.investments.where({year: year}).toArray());
  const incomes = useLiveQuery(() => db.income.where({year: year}).toArray());

  const [active, setActive] = useState<Tab>(Tab.EXPENSES);

  function isTabActive(type: Tab){
    return type == active ? 'active-section' : ''
  }

  function renderContent(){
    switch (active) {
      case Tab.INVESTMENTS:
        return <Investments year={year}/>
      case Tab.INCOME:
        return <Income year={year}/>
      case Tab.GROCERIES:
        return <Groceries year={year}/>
      default:
        return <Expenses year={year}/>
    }
  }

  function getExpensesTotal(){
    let amt:number = 0;
    let expected: number= 0;
    if(expenses){
        for (let index = 0; index < expenses.length; index++) {
            const e = expenses[index];
            amt += Number(e.actualAmount);
            expected += Number(e.expectedAmount)
        }
    }
    return expected - amt
  }

  function getIncomesTotal(){
    let amt:number = 0;
    let expected: number= 0;
    if(incomes){
        for (let index = 0; index < incomes.length; index++) {
            const e = incomes[index];
            amt += Number(e.actualAmount);
            expected += Number(e.expectedAmount)
        }
    }
    return expected - amt
  }

  function getInvestmentsTotal(){
    let amt:number = 0;
    let expected: number= 0;
    if(investments){
        for (let index = 0; index < investments.length; index++) {
            const e = investments[index];
            amt += Number(e.actualAmount);
            expected += Number(e.expectedAmount)
        }
    }
    return expected - amt
  }
  return (
    <main className=" p-24 w-100">
      <div className='w-11/12'>
        <h1 className="inline-block w-3/12">Welcome back, Tshegofatso</h1>
        <h2 className='font-bold text-stone-100 text-end inline-block w-9/12' style={{fontSize: '36px'}}>
          2023 December Budget <button className="inline-block" >
        <Image alt="edit" src={settingsSvg} height={25} width={25} className=" btn-edit"/>
    </button>
        </h2>
        </div>
        <div className='w-100 p-5'>
          <div className='inline-block mr-5 w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <h1>Expenses</h1>
            <div>R{getExpensesTotal()}</div>
          </div>

          <div className='inline-block mr-5  w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Investments</div>
            <div>R{getInvestmentsTotal()}</div>
          </div>

          <div  className='inline-block mr-5 w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Income</div>
            <div>R{getIncomesTotal()}</div>
          </div>


          {/* <div  className='inline-block mr-5 w-3/12 text-center btn-add' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Clone</div>
            <div>Bugdet</div>
          </div> */}
          <div  className='inline-block w-3/12' style={{padding:'1rem' }}>
            {/* <Calendar/> */}
          </div>
        </div>
        <div className='w-100'>
          <div 
           className={`inline-block p-4 ${isTabActive(Tab.GROCERIES)}`}
           onClick={(e)=> setActive(Tab.GROCERIES)}
           > 
              Groceries
          </div>
          <div 
           className={`inline-block p-4 ${isTabActive(Tab.EXPENSES)}`}
           onClick={(e)=> setActive(Tab.EXPENSES)}
           > 
              Expenses
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
