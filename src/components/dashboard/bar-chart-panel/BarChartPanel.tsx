import { ExpenseItem, GroceryItem } from '@/model/models';
import React, { useState } from 'react';

import { Tab, isTabActive } from '@/model/shared';
import GroceriesBarChart from './GroceriesBarChart';
import ExpsenseBarChart from './ExpensesBarChart';
import InvestmentsBarChart from './InvestmentsBarChart';

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
    return (
        <div className="w-8/12 text-white inline-block h-100">
        <div className='content border-white w-100 h-100 p-4'>
          {renderContent()}
        </div>
          <div 
           className={`inline-block p-4 ${isTabActive(Tab.GROCERIES, active)}`}
           onClick={(e)=> setActive(Tab.GROCERIES)}
           > 
              Groceries
          </div>
          <div 
           className={`inline-block p-4 ${isTabActive(Tab.EXPENSES, active)}`}
           onClick={(e)=> setActive(Tab.EXPENSES)}
           > 
              Expenses
          </div>
          <div 
            className={`inline-block p-4 ${isTabActive(Tab.INVESTMENTS, active)}`}
            onClick={(e)=> setActive(Tab.INVESTMENTS)}
           >
              Investments
          </div>
        </div>
    );
}

export default BarChartPanel;
