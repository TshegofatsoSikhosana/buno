'use client'
import Calendar from '@/components/Calendar';
import Expenses from '@/components/expense/Expenses'
import Groceries from '@/components/groceries/Groceries';
import Income from '@/components/income/Income';
import Investments from '@/components/investment/Investments';
import { db } from '@/config/database.config';
import { useLiveQuery } from 'dexie-react-hooks';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import settingsSvg from '../assets/settings.svg'
import { DatePicker } from 'react-responsive-datepicker';
import 'react-responsive-datepicker/dist/index.css'
import closeSvg from '../assets/close.svg'
import { ExpenseItem, IncomeItem, InvestmentItem } from '@/model/models';


enum Tab{
  EXPENSES,
  INVESTMENTS,
  INCOME,
  GROCERIES
}
export default function Home() {

  const [year, setYear] = useState<number>(2024);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November" , "December"]
  const [month,setMonth] = useState<number>(1);
  const [expenses,setExpenses] = useState<ExpenseItem[]>([]);

  const [investments,setInvestments] = useState<InvestmentItem[]>([]);
  const [incomes,setIncomes] = useState<IncomeItem[]>([]);

  const [active, setActive] = useState<Tab>(Tab.EXPENSES);
  const [openForm,setOpenForm] = useState(false);

  function isTabActive(type: Tab){
    return type == active ? 'active-section' : ''
  }

  function renderContent(){
    switch (active) {
      case Tab.INVESTMENTS:
        return <Investments year={year} month={month}/>
      case Tab.INCOME:
        return <Income year={year} month={month}/>
      case Tab.GROCERIES:
        return <Groceries year={year} month={month}/>
      default:
        return <Expenses year={year} month={month}/>
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

  useEffect(()=>{
    getExpenses();
    getIncomes();
    getInvestments();
  },[year,month])

  function getExpenses(){
    db.expenses.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray()
    .then((ex)=> {
        setExpenses([...ex]);
    });
  }

  function getIncomes(){
    db.income.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray()
    .then((ex)=> {
        setIncomes([...ex]);
    });
  }

  function getInvestments(){
    db.investments.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray()
    .then((ex)=> {
        setInvestments([...ex]);
    });
  }

  return (
    <main className=" p-24 w-100">
      <div className='w-11/12'>
        <h1 className="inline-block w-3/12">Welcome back</h1>
        <h2 className='font-bold text-stone-100 text-end inline-block w-9/12' style={{fontSize: '36px'}}>
          {year} {months[month-1]} Budget 
        <button className="inline-block" >
          <Image alt="edit" src={settingsSvg} height={25} width={25} className=" btn-edit ml-2" onClick={(e)=> setOpenForm(!openForm)}/>        
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
          <div className="inline-block w-5/12">
          {openForm ? 
              <>
                  <div className="w-100 " onClick={()=> setOpenForm(false)}>
                    <Image alt="delete"
                        src={closeSvg}
                        height={25} width={25}
                        className="inline-block"/>
                    <div className="inline-block text-slate-600 btn-close">Close</div>
                </div>
                <div className="p-2">
                    <div className="inline-block mr-2 ">
                        <div> Year</div>
                        <input type="number" className="text-black" value={year} onChange={(e)=> setYear(Number(e.target.value))}/>
                    </div>
                    <div className="inline-block mr-2">
                        <div> Month</div>
                        <input type="number" min={1} max={12} className="text-black" value={month}  onChange={(e)=> setMonth(Number(e.target.value))}/>
                    </div>
                </div>
            </>: null}
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
