'use client'
import Calendar from '@/components/Calendar';
import Expenses from '@/components/expense/Expenses'
import Groceries from '@/components/groceries/Groceries';
import Income from '@/components/income/Income';
import Investments from '@/components/investment/Investments';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import settingsSvg from '../assets/settings.svg'
import cloneSvg from '../assets/clone.svg'
import { DatePicker } from 'react-responsive-datepicker';
import 'react-responsive-datepicker/dist/index.css'
import closeSvg from '../assets/close.svg'
import { db } from '@/config/database.config';
import { getRemainingTotal, months } from '../util/utils';
import Link from 'next/link';
import CloneModal from '@/components/clone/CloneModal';
import Icon from '@/components/shared/Icon';
import { useAppDispatch } from '@/store/hooks';
import { budgetActions, budgetSelectors } from '@/store';
import { useSelector } from 'react-redux';


enum Tab{
  EXPENSES,
  INVESTMENTS,
  INCOME,
  GROCERIES
}
export default function Home() {

  const dispatch = useAppDispatch();

  const year= useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);
  
  const [totalExpenses,setTotalExpenses] = useState<number>(0);
  const [totalInvestments,setTotalInvestments] = useState<number>(0);
  const [totalIncomes,setTotalIncomes] = useState<number>(0);

  const [active, setActive] = useState<Tab>(Tab.EXPENSES);
  const [openForm,setOpenForm] = useState(false);
  const [openCloneModal,setOpenCloneModal] = useState(false);

  function isTabActive(type: Tab){
    return type == active ? 'active-section' : ''
  }

  function renderContent(){
    switch (active) {
      case Tab.INVESTMENTS:
        return <Investments setTotalInvestments={setTotalInvestments}/>
      case Tab.INCOME:
        return <Income setTotalIncomes={setTotalIncomes}/>
      case Tab.GROCERIES:
        return <Groceries />
      default:
        return <Expenses setTotalExpenses={setTotalExpenses} />
    }
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
        setTotalExpenses(getRemainingTotal([...ex]));
    });
  }

  function getIncomes(){
    db.income.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray()
    .then((ex)=> {
        setTotalIncomes(getRemainingTotal([...ex]));
    });
  }

  function getInvestments(){
    db.investments.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray()
    .then((ex)=> {
        setTotalInvestments(getRemainingTotal([...ex]));
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
    <main className=" p-24 w-100">
      <div className='w-11/12'>
        <h1 className="inline-block w-3/12">Welcome back</h1>
        <h2 className='font-bold text-stone-100 text-end inline-block w-9/12' style={{fontSize: '36px'}}>
          {year} {months[month-1]} Budget 
        <button className="inline-block" >
          <Icon svgPath={settingsSvg} onClick={() => setOpenForm(!openForm)}/>    
        </button>
        <button  className="inline-block">
          <Icon svgPath={cloneSvg} onClick={() => setOpenCloneModal(true)}/>      
        </button>
        </h2>
        </div>
        <div className='w-100 p-5'>
          <div className='inline-block mr-5 w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <h1>Expenses</h1>
            <div>R{totalExpenses}</div>
          </div>

          <div className='inline-block mr-5  w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Investments</div>
            <div>R{totalInvestments}</div>
          </div>

          <div  className='inline-block mr-5 w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Income</div>
            <div>R{totalIncomes}</div>
          </div>
          <div className="inline-block w-5/12">
          {openForm ? 
              <>
                <div className="p-2">
                    <div className="inline-block mr-2 w-4/12 p-2">
                        <div> Year</div>
                        <input type="text" className="text-black mr-3 w-6/12 inline-block" value={year} />
                        <div className='btn-minus w-1/12 inline-block p-1 mr-1' onClick={(e)=> updateYear(year-1)}> -</div> 
                        <div className='btn-plus w-1/12 inline-block p-1'  onClick={(e)=> updateYear(year+1)}> +</div> 
                    </div>
                    <div className="inline-block mr-2 w-4/12">
                        <div> Month</div>
                        <input type="text" className="text-black mr-3 w-6/12 inline-block" value={month} />
                        <div className='btn-minus w-1/12 inline-block p-1 mr-1' onClick={(e)=>  updateMonth(Number(month-1))}> -</div> 
                        <div className='btn-plus w-1/12 inline-block p-1' onClick={(e)=>  updateMonth(Number(month+1))}> +</div> 
                    </div>
                    <div className="w-3/12 inline-block" onClick={()=> setOpenForm(false)}>
                    <Image alt="delete"
                        src={closeSvg}
                        height={25} width={25}
                        className="inline-block"/>
                    <div className="inline-block text-slate-600 btn-close">CLOSE</div>
                </div>
                </div>
            </>: null}
        </div>

          <CloneModal open={openCloneModal} setOpen={setOpenCloneModal}/>
          {/* <d/>iv  className='inline-block w-3/12' style={{padding:'1rem' }}> */}
            {/* <Calendar/> */}
          {/* </div> */}
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
          {/* <Link href={"/luno"}
            className={`inline-block p-4 ${isTabActive(Tab.INCOME)}`}
            
           >
              Luno Dashboard
          </Link> */}
        </div>
        <div className='content border-white w-100 h-100 p-4'>
          {renderContent()}
        </div>
    </main>
  )
}
