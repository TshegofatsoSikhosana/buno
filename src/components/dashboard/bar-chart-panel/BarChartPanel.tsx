import React, { useState } from 'react';

import { Tab, isTabActive } from '@/model/shared';
import GroceriesBarChart from './GroceriesBarChart';
import ExpsenseBarChart from './ExpensesBarChart';
import InvestmentsBarChart from './InvestmentsBarChart';
import ExpsenseDoughnut from '../doughnuts/ExpensesDoughnut';
import GroceriesDoughnut from '../doughnuts/GroceriesDoughnut';
import InvestmentsDoughnut from '../doughnuts/InvestmentsDoughnut';


function BarChartPanel(){
    const [active, setActive] = useState<Tab>(Tab.EXPENSES);

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
          </div></div>
        <div className="w-9/12 text-white inline-block h-100">
        <div className='content border-white w-100 h-100 p-4' style={{minHeight: '750px'}}>
          {renderContent()}
        </div>
          
        </div>
        {/* <div className="w-4/12 text-white inline-block">
            {renderDoughnut()}
        </div> */}
        </>
    );
}

export default BarChartPanel;
