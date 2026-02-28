'use client'
import Calendar from '@/components/Calendar';
import Expenses from '@/components/expense/Expenses'
import Groceries from '@/components/groceries/Groceries';
import Income from '@/components/income/Income';
import Investments from '@/components/investment/Investments';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import calendarSettingsSvg from '../assets/calendar-settings.svg'
import settingsSvg from '../assets/settings.svg'
import shareSvg from '../assets/share.svg'
import cloneSvg from '../assets/clone.svg'
import { DatePicker } from 'react-responsive-datepicker';
import 'react-responsive-datepicker/dist/index.css'
import closeSvg from '../assets/close.svg'
// import reportSvg from "../assets/report.svg";
import { db } from '@/config/database.config';
import { getExpectedTotal, getRemainingTotal, months } from '../util/utils';
import CloneModal from '@/components/clone/CloneModal';
import Icon from '@/components/shared/Icon';
import { useAppDispatch } from '@/store/hooks';
import { budgetActions, budgetSelectors } from '@/store';
import { useSelector } from 'react-redux';
import Dashboard from '@/components/dashboard/Dashboard';
import { Tab, isTabActive } from '@/model/shared';
import ShareModal from '@/components/share/ShareModal';
import Goals from '@/components/goals/Goals';
// import CarLoan from '@/components/car-loan/CarLoan';



export default function Home() {

  const dispatch = useAppDispatch();

  const year= useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);
  
  const [totalExpenses,setTotalExpenses] = useState<number>(0);
  const [totalInvestments,setTotalInvestments] = useState<number>(0);
  const [totalIncomes,setTotalIncomes] = useState<number>(0);
  const [budgetRemainder,setBudgetRemainder] = useState<number>(0);

  const [active, setActive] = useState<Tab>(Tab.EXPENSES);
  const [openForm,setOpenForm] = useState(false);
  const [openCloneModal,setOpenCloneModal] = useState(false);
  const [openShareModal,setOpenShareModal] = useState(false);

  function renderContent(){
    switch (active) {
      case Tab.INVESTMENTS:
        return <Investments setTotalInvestments={setTotalInvestments}/>
      case Tab.INCOME:
        return <Income setTotalIncomes={setTotalIncomes}/>
      case Tab.GROCERIES:
        return <Groceries />
      case Tab.DASHBOARD:
        return <Dashboard />
      case Tab.GOALS:
        return <Goals />
      // case Tab.CAR_LOAN:
      //   return <CarLoan setTotalExpenses={setTotalExpenses} />
      default:
        return <Expenses setTotalExpenses={setTotalExpenses} />
    }
  }

  useEffect(()=>{
    getExpenses();
    getIncomes();
    getInvestments();
    getRemainder();
  },[year,month]);


  async function getRemainder(){
    const expenses = await db.expenses.where({year: year})
    .and((i)=> Number(i.month) == month )
    .toArray();
    const investments = await db.investments.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray();
    const incomes = await db.income.where({year: year})
    .and((i)=> Number(i.month) == month)
    .toArray();
    const remainder = getExpectedTotal(incomes) - getExpectedTotal(expenses) - getExpectedTotal(investments);
    setBudgetRemainder(remainder);
  }

  function getExpenses(){
    db.expenses.where({year: year})
    .and((i)=> Number(i.month) == month && i.actualAmount <= 0)
    .toArray()
    .then((ex)=> {
        setTotalExpenses(getRemainingTotal([...ex]));
    });
  }

  function getIncomes(){
    db.income.where({year: year})
    .and((i)=> Number(i.month) == month && i.actualAmount <= 0)
    .toArray()
    .then((ex)=> {
        setTotalIncomes(getRemainingTotal([...ex]));
    });
  }

  function getInvestments(){
    db.investments.where({year: year})
    .and((i)=> Number(i.month) == month && i.actualAmount <= 0)
    .toArray()
    .then((ex)=> {
        setTotalInvestments(getRemainingTotal([...ex]));
    });
  }

  function updateYear(year:number){
    dispatch(budgetActions.setCurrentYear(year))
  }

  function updateMonth(month:number){
    console.log('monthh',month);
    
    if(month > 0 && month <= 12){
        dispatch(budgetActions.setCurrentMonth(month))
    }else if(month === 0){
        dispatch(budgetActions.setCurrentYear(year-1));
        dispatch(budgetActions.setCurrentMonth(12));
    }else if(month === 13){
       dispatch(budgetActions.setCurrentYear(year+1));
        dispatch(budgetActions.setCurrentMonth(1));
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
        <button  className="inline-block">
          <Icon svgPath={shareSvg} onClick={() => setOpenShareModal(true)}/>      
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
              </>: <>
              {/* <div  className='inline-block mr-5 w-4/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
                <div>Remainder</div>
                <div>R{budgetRemainder}</div>
              </div> */}
              </>
          }
        </div>

          {openCloneModal && <CloneModal open={openCloneModal} setOpen={setOpenCloneModal}/>}
          {openShareModal && <ShareModal open={openShareModal} setOpen={setOpenShareModal}/>}
          {/* <d/>iv  className='inline-block w-3/12' style={{padding:'1rem' }}> */}
            {/* <Calendar/> */}
          {/* </div> */}
        </div>
        <div className='w-100'>
          <div 
           className={`tab-option inline-block p-4 ${isTabActive(Tab.GROCERIES, active)}`}
           onClick={(e)=> setActive(Tab.GROCERIES)}
           > 
              Groceries
          </div>
          <div 
           className={`tab-option inline-block p-4 ${isTabActive(Tab.EXPENSES, active)}`}
           onClick={(e)=> setActive(Tab.EXPENSES)}
           > 
              Expenses
          </div>
          <div 
            className={`tab-option inline-block p-4 ${isTabActive(Tab.INVESTMENTS, active)}`}
            onClick={(e)=> setActive(Tab.INVESTMENTS)}
           >
              Investments
          </div>
          <div 
            className={`tab-option inline-block p-4 ${isTabActive(Tab.INCOME, active)}`}
            onClick={(e)=> setActive(Tab.INCOME)}
           >
              Income
          </div>
          <div 
           className={`tab-option inline-block p-4 ${isTabActive(Tab.DASHBOARD, active)}`}
           onClick={(e)=> setActive(Tab.DASHBOARD)}
           > 
            {/* <div className='inline-block p-1'><Icon svgPath={reportSvg} onClick={() => {}}/> </div>  */}
            <div className='inline-block'> Budget-Dashboard</div>
          </div>
          <div 
           className={`tab-option inline-block p-4 ${isTabActive(Tab.GOALS, active)}`}
           onClick={(e)=> setActive(Tab.GOALS)}
           > 
            <div className='inline-block'> Goals 🎯</div>
          </div>
          {/* <div 
            className={`tab-option inline-block p-4 ${isTabActive(Tab.CAR_LOAN, active)}`}
            onClick={(e)=> setActive(Tab.CAR_LOAN)}
           >
              Car Loan
          </div> */}
          {/* <Link href={"/luno"}
            className={`inline-block p-4 ${isTabActive(Tab.INCOME, active)}`}
            
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
