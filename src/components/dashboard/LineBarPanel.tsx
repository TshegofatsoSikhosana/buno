import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  } from 'chart.js';
import { db } from '@/config/database.config';
import { months } from '@/util/utils';
import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

function LineBarPanel(){
    const [groceries,setGroceries] = useState<{labels: string[], data: number[]}>();
    const [expenses,setExpsense] = useState<{labels: string[], data: number[]}>();
    const [investments,setInvestments] = useState<{labels: string[], data: number[]}>();

    function getGroceries(){
      db.groceries
      .toArray()
      .then((ex)=> {
          const monthSet = new Set<string>();
          ex.forEach((e)=>{
            if(months[Number(e.month)-1]){
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
            }
          })
          const monthsLabels = Array.from(monthSet)
          setGroceries({ labels: monthsLabels, data: getTotals(monthsLabels, ex)})
      });
    }

    function getExpenses(){
      db.expenses
      .toArray()
      .then((ex)=> {
          const monthSet = new Set<string>();
          ex.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
          })
          const monthsLabels = Array.from(monthSet)
          setExpsense({ labels: monthsLabels, data: getTotals(monthsLabels, ex.filter((e)=> e.description.toLowerCase() !== "groceries"))})
      });
    }

    function getInvestments(){
      db.investments
      .toArray()
      .then((ex)=> {
          const monthSet = new Set<string>();
          ex.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
          })
          const monthsLabels = Array.from(monthSet)
          setInvestments({ labels: monthsLabels, data: getTotals(monthsLabels, ex)})
      });
    }

    function getTotals(monthsLabels: string[], data: any[],){
      const totals = []
      for (let i = 0; i< monthsLabels.length; i++) {
        const item = monthsLabels[i];

        const filtered = data.filter((e)=>  months[Number(e.month)-1] + " " + e.year === item)
          .map((e)=> Number(e.actualAmount));

        if(filtered){
          const total = filtered.reduce((a,b)=> Number(a)+Number(b))
          totals.push(total);
        }
      }
      return totals;
    }

    useEffect(()=>{
      getGroceries()
      getExpenses()
      getInvestments()
      },[])

    return (
        <div className="w-11/12 text-white inline-block">
        {groceries?.data && groceries?.labels &&
         <Line data={{
            labels: groceries?.labels,
            datasets: [{
                data: groceries?.data,
                borderColor: 'rgba(30, 148, 222)',    
                label: 'Groceries'
            },{
                data: expenses?.data,
                borderColor: '#a33dee',    
                label: 'Expenses'
            },
            {
                data: investments?.data,
                borderColor: 'rgb(65, 194, 123)',
                label: 'Investments'    
            }]
            }}
            options={{
                layout:{padding:2},
                color:"white",
                scales: {
                    
                },
                elements: {
                  bar: {
                    borderWidth: 2,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    display: true,
                    labels:{ 
                        color:'white'
                    },
                    
                  },
                  title: {
                    display: true,
                    text: 'Past Budget Totals By Category Overview',
                    color:'white'
                  },
                  
                }
            }}
            style={{color: "white"}}/>}
    </div>
    );
}

export default LineBarPanel;
