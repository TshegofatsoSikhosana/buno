import React, { useState } from 'react';

import { Tab, isTabActive } from '@/model/shared';
import ExpsenseBarChart from '../../expense/dashboard-charts/ExpensesBarChart';
import InvestmentsBarChart from '../../investment/dashboard-charts/InvestmentsBarChart';
import ExpsenseDoughnut from '../doughnuts/ExpensesDoughnut';
import GroceriesDoughnut from '../doughnuts/GroceriesDoughnut';
import InvestmentsDoughnut from '../doughnuts/InvestmentsDoughnut';
import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';
import { budgetActions, budgetSelectors } from '@/store';
import IncomesBarChart from '../../income/dashboard-charts/IncomesBarChart';
import GroceriesBarChart from '@/components/groceries/dashboard-charts/GroceriesBarChart';


function BarChartPanel(){
    const dispatch = useAppDispatch();

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [active, setActive] = useState<Tab>(Tab.EXPENSES);
    const [openForm,setOpenForm] = useState(false);

    function renderContent(){
        switch (active) {
          case Tab.INVESTMENTS:
            return <InvestmentsBarChart/>
          case Tab.GROCERIES:
            return <GroceriesBarChart />
          case Tab.INCOME:
            return <IncomesBarChart />
          default:
            return <ExpsenseBarChart />
        }
      }

    function renderDoughnut(){
      switch (active) {
        case Tab.INVESTMENTS:
          return <InvestmentsDoughnut/>
        case Tab.GROCERIES:
          return <GroceriesDoughnut />
        default:
          return <ExpsenseDoughnut />
      }
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
        <div className='w-100'>
        <div 
           className={`inline-block p-4 ${isTabActive(Tab.EXPENSES, active)}`}
           onClick={(e)=> setActive(Tab.EXPENSES)}
           > 
              Expenses
          </div>
        <div 
           className={`inline-block p-4 ${isTabActive(Tab.GROCERIES, active)}`}
           onClick={(e)=> setActive(Tab.GROCERIES)}
           > 
              Groceries
          </div>
          <div 
            className={`inline-block p-4 ${isTabActive(Tab.INVESTMENTS, active)}`}
            onClick={(e)=> setActive(Tab.INVESTMENTS)}
           >
              Investments
          </div>
           <div 
            className={`inline-block p-4 ${isTabActive(Tab.INCOME, active)}`}
            onClick={(e)=> setActive(Tab.INCOME)}
           >
              Incomes
          </div>
        </div>
        <div className="w-9/12 text-white inline-block h-100">
          <div className='content border-white w-100 h-100 p-4' style={{minHeight: '420px'}}>
            {renderContent()}
          </div>
        </div>
        </>
    );
}

export default BarChartPanel;
