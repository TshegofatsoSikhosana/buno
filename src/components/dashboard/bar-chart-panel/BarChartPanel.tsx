import React, { useState } from 'react';

import { Tab, isTabActive } from '@/model/shared';
import GroceriesBarChart from './GroceriesBarChart';
import ExpsenseBarChart from './ExpensesBarChart';
import InvestmentsBarChart from './InvestmentsBarChart';
import ExpsenseDoughnut from '../doughnuts/ExpensesDoughnut';
import GroceriesDoughnut from '../doughnuts/GroceriesDoughnut';
import InvestmentsDoughnut from '../doughnuts/InvestmentsDoughnut';
import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';
import { budgetActions, budgetSelectors } from '@/store';
import Image from 'next/image';
import closeSvg from '../../../assets/close.svg'
import settingsSvg from '../../../assets/settings.svg'
import { months } from '@/util/utils';
import Icon from '@/components/shared/Icon';


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
