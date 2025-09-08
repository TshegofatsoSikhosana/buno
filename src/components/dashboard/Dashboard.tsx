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
import { months } from '@/util/utils';
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
    const [avgExpenses,setAvgExpenses] = useState<number>(0);
    const [avgInvestments,setAvgInvestments] = useState<number>(0);
    const [avgGroceries,setAvgGroceries] = useState<number>(0);
    const [avgIncomes,setAvgIncomes] = useState<number>(0);

    useEffect(()=>{
        getExpenses();
        getGroceries();
        getInvestments();
        getIncomes();
    },[year,month]);

    function getExpenses(){
        db.expenses.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            const g=  ex.filter((e)=> e.description.toLowerCase() !== "groceries")
            if(g.length > 0){
              setTotalExpenses(g.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c)));
            }
        });
        db.expenses.toArray()
        .then(expenses=>{
          const monthSet = new Set<string>();
          expenses.forEach((e)=>{
            if(months[Number(e.month)-1]){
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
            }
          })
          const monthsLabels = Array.from(monthSet)
          const total = expenses.filter(exp=> exp.description?.toLowerCase() !== "groceries").map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c));
            const avg = total/monthsLabels.length;
            setAvgExpenses(Math.round(avg))
        })
      }
    
      function getGroceries(){
        db.groceries.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
          if(ex.length > 0){
            setTotalGroceries(ex.map((e)=> e.actualAmount - Number(e.discountAmount)).reduce((p,c)=> Number(p) + Number(c)));
          }
        });
        db.groceries.toArray()
        .then(inv=>{
          const monthSet = new Set<string>();
          inv.forEach((e)=>{
            if(months[Number(e.month)-1]){
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
            }
          })
          const monthsLabels = Array.from(monthSet)
          const total = inv.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c));
            const avg = total/monthsLabels.length;
            setAvgGroceries(Math.round(avg))
        })
      }

      function getIncomes(){
        db.income.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
          if(ex.length > 0){
            setTotalIncomes(ex.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c)));
          }
        });
        db.income.toArray()
        .then(inv=>{
          const monthSet = new Set<string>();
          inv.forEach((e)=>{
            if(months[Number(e.month)-1]){
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
            }
          })
          const monthsLabels = Array.from(monthSet)
          const total = inv.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c));
            const avg = total/monthsLabels.length;
            setAvgIncomes(Math.round(avg))
        })
      }
    
      function getInvestments(){
        db.investments.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
          if(ex.length > 0){
            setTotalInvestments(ex.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c)));
          }
        });
        db.investments.toArray()
        .then(inv=>{
          const monthSet = new Set<string>();
          inv.forEach((e)=>{
            if(months[Number(e.month)-1]){
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
            }
          })
          const monthsLabels = Array.from(monthSet)
          const total = inv.map((e)=> e.actualAmount).reduce((p,c)=> Number(p) + Number(c));
            const avg = total/monthsLabels.length;
            setAvgInvestments(Math.round(avg))
        })
      }

    return (<div className='dashboard-container'>
        <div className='w-100 p-5'>
          <div className='inline-block w-2/12' style={{padding:'3rem',borderRadius:'10px' }}>
            <h1>Budget Month Averages:</h1>
            <div> </div>
          </div>
          <div className='inline-block mr-5 w-2/12' style={{border:'2px solid rgba(222,222,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <h1>Groceries</h1>
            <div>R{avgGroceries}</div>
          </div>
          <div className='inline-block mr-5 w-2/12' style={{border:'2px solid rgba(222,222,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <h1>Expenses</h1>
            <div>R{avgExpenses}</div>
          </div>

          <div className='inline-block mr-5  w-2/12' style={{border:'2px solid rgba(222,222,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Investments</div>
            <div>R{avgInvestments}</div>
          </div>

          {/* <div  className='inline-block mr-5 w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <div>Income</div>
            <div>R{avgIncomes}</div>
          </div> */}
        </div>
        {/* <h1 className='w-100 bg-white text-black p-3 text-center mt-4' style={{borderRadius: '10px', fontWeight: 700}}>Per Budget Month View</h1> */}
        <div className="w-8/12 text-white inline-block">
        <LineBarPanel/>
        </div>
        <div className="w-4/12 text-white inline-block">
               <DoughnutChart includeLabels={true}
                  values={[totalGroceries,totalExpenses,totalInvestments,totalIncomes-totalExpenses-totalInvestments-totalGroceries]}
                  labels={["Grocieries","Expense", "Investments","Remainder"]}
                  colors={["rgba(30, 148, 222)","#a33dee","#deedee","rgb(65, 194, 123)"]}
                  />            
        </div>
        <div className=' bg-white text-black p-5 text-left' style={{borderRadius: '10px', fontWeight: 700, marginTop: '69px'}}> Per Category Budget Overview</div  >
        <BarChartPanel/>
       
    </div>);
}

export default Dashboard;
