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
import BarChartPanel from './bar-chart-panel/BarChartPanel';
import LineBarPanel from './LineBarPanel';
import DoughnutChart from './doughnuts/DoughnutChart';
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

function Dashboard(){
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [totalExpenses,setTotalExpenses] = useState<number>(0);
    const [totalInvestments,setTotalInvestments] = useState<number>(0);
    const [totalGroceries,setTotalGroceries] = useState<number>(0);
    const [totalIncomes,setTotalIncomes] = useState<number>(0);

    useEffect(()=>{
        getExpenses();
        getGroceries();
        getInvestments();
        getIncomes()
    },[year,month]);

    function getExpenses(){
        db.expenses.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            const g=  ex.filter((e)=> e.description.toLowerCase() !== "groceries")
            setTotalExpenses(g.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c)));
        });
      }
    
      function getGroceries(){
        db.groceries.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setTotalGroceries(ex.map((e)=> e.actualAmount - Number(e.discountAmount)).reduce((p,c)=> Number(p) + Number(c)));
        });
      }

      function getIncomes(){
        db.income.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setTotalIncomes(ex.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c)));
        });
      }
    
      function getInvestments(){
        db.investments.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setTotalInvestments(ex.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c)));
        });
      }

    return (<div className='dashboard-container'>

        {/* <h1 className='w-100 bg-white text-black p-3 text-center mt-4' style={{borderRadius: '10px', fontWeight: 700}}>Per Budget Month View</h1> */}
        <div className="w-8/12 text-white inline-block">
        <LineBarPanel/>
        </div>
        <div className="w-4/12 text-white inline-block">
               <DoughnutChart includeLabels={true}
                  values={[totalGroceries,totalExpenses,totalInvestments,totalIncomes-totalExpenses-totalInvestments-totalGroceries]}
                  labels={["Grocieries","Expense", "Investments","Remainder"]}
                  colors={["rgba(30, 148, 222)","#a33dee","rgb(65, 194, 123)","#deedee"]}
                  />            
        </div>
        <div className=' bg-white text-black p-3 text-left mt-4' style={{borderRadius: '10px', fontWeight: 700}}> <button style={{border: '2px solid white', padding:'2px'}}>Per Category</button>  <button> Budget Overview</button></div  >
        <BarChartPanel/>
       
    </div>);
}

export default Dashboard;
