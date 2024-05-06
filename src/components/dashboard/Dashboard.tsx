import React, { useEffect, useState } from 'react';
import { db } from '@/config/database.config';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
import { ExpenseItem, GroceryItem } from '@/model/models';
import BarChartPanel from './bar-chart-panel/BarChartPanel';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
ChartJS.register(ArcElement, Tooltip, Legend)

function Dashboard(){
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [totalExpenses,setTotalExpenses] = useState<number>(0);
    const [totalInvestments,setTotalInvestments] = useState<number>(0);
    const [totalGroceries,setTotalGroceries] = useState<number>(0);
    const [totalIncomes,setTotalIncomes] = useState<number>(0);

    const [groceries,setGroceries] = useState<ExpenseItem[]>([]);
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
            setGroceries(ex.sort((a,b)=> b.actualAmount - a.actualAmount))
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
        
        <BarChartPanel/>
        <div className="w-4/12 text-white inline-block">
            <Doughnut data={{
                labels: ["Grocieries","Expense", "Investments","Remainder"],
                datasets: [{
                    data: [totalGroceries,totalExpenses,totalInvestments,totalIncomes-totalExpenses-totalInvestments-totalGroceries],
                    backgroundColor:["#deedee","#a33dee","rgb(65, 194, 123)","rgba(30, 148, 222)"],
                    }]
                }}
                options={{
                    color:"white"
                }}
                style={{color: "white"}}/>
        </div>
    </div>);
}

export default Dashboard;
