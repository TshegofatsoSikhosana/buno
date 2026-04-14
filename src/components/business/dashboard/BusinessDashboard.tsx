import React, { useEffect, useState } from 'react';
import { db } from '@/config/database.config';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { filterByMonthAndYear, months } from '@/util/utils';
import BusinessBarChart from './BusinessBarChart';
import DatePicker from '@/components/dashboard/bar-chart-panel/DatePicker';
import DoughnutChart from '@/components/dashboard/doughnuts/DoughnutChart';
import LineBarPanel from '@/components/dashboard/line-chart-panel/LineChartPanel';
import BusinessIncomeBarChart from './BusinessIncomeBarChart';
import { BusinessItem } from '@/model/models';
import BusinessExpenseBarChart from './BusinessExpenseBarChart';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);



function BusinessDashboard({selectedBusiness} : {selectedBusiness : BusinessItem}) {
  const year = useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);
  const [entriesTotal, setEntriesTotal] = useState<number>(0);
  const [paymentsTotal, setPaymentsTotal] = useState<number>(0);
  const [avgIncome, setAvgIncome] = useState<number>(0);


  useEffect(() => {

      if (selectedBusiness) {
          let totalExpense = 0;
          selectedBusiness.expenseItems?.map((item) => {
              totalExpense += Number(item.expectedAmount);
          })

          let totalIncome = 0;
          selectedBusiness.incomeItems?.map((item) => {
              totalIncome += Number(item.amount);
          })
          setEntriesTotal(Math.round(totalExpense));
          setPaymentsTotal(Math.round(totalIncome));
          setAvgIncome(Math.round(totalIncome / (selectedBusiness.incomeItems?.filter((item) => Number(item.amount) !== 0).length || 1)));

          // totalExpected = 0;
          // totalIncome = 0;
          // filterByMonthAndYear(selectedBusiness.incomeItems as [], year, month).map((item) => {
          //     totalExpected += Number(item.expectedAmount);
          //     totalIncome += Number(item.amount);
          // })
      }
  }, [selectedBusiness, year, month]);

 
  return (<div className='dashboard-container'>
    <div className='w-100 p-5'>
      <div className='inline-block w-2/12 '  style={{ padding: '3rem', borderRadius: '10px' }}>
        <h1>Income Statistics:</h1>
        <div> </div>
      </div>
      <div className='inline-block mr-5 w-2/12 total-card' >
         <h1>Average Income</h1>
         <div>R{avgIncome}</div>
      </div>
      <div className='inline-block mr-5 w-2/12 total-card'>
          <h1>Total Expense Costs</h1>
          <div>R{entriesTotal}</div>  
      </div>

      <div className='inline-block mr-5  w-2/12 total-card'>
          <h1>Total Received Income</h1>
          <div>R{paymentsTotal}</div>
      </div>

      <div className='inline-block mr-5 w-2/12 total-card-blue'>
          <h1>Total Remainder</h1>
          <div>R{Math.round(entriesTotal - paymentsTotal )}</div>
      </div>
      </div>
    <div className='inline-block w-6/12 p-2'><BusinessExpenseBarChart /></div>
    <div className='inline-block w-6/12 p-2'><BusinessIncomeBarChart /></div>

  </div >);
}

export default BusinessDashboard;
