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
import { getItemsInOrder, months } from '@/util/utils';
import { Line } from 'react-chartjs-2';
import { ExpenseItem } from '@/model/models';
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

interface ExpensesLineChartPanelProps{
  filteredExpenses: ExpenseItem[]
}


function ExpensesLineChartPanel(props: ExpensesLineChartPanelProps){
    const {filteredExpenses} = props;
    const [expenses,setExpsense] = useState<{labels: string[], data: number[]}>();
    const [allExpenses, setAllExpenses] = useState<ExpenseItem[]>();


    useEffect(()=>{
      if(filteredExpenses){
        console.log('filtered', filteredExpenses);
        
        const monthSet = new Set<string>();
          const items = getItemsInOrder(filteredExpenses);
          setAllExpenses(filteredExpenses)
          items.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
              e.actualAmount = Number(e.actualAmount)
          })
          const monthsLabels = Array.from(monthSet)
          setExpsense({ labels: monthsLabels, data: getTotals(monthsLabels, items)})
      }
    }, [filteredExpenses])

    function getExpenses(){
      db.expenses
      .toArray()
      .then((ex)=> {
          const monthSet = new Set<string>();
          const items = getItemsInOrder(ex);
          setAllExpenses(ex)
          items.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
              e.actualAmount = Number(e.actualAmount)
          })
          const monthsLabels = Array.from(monthSet)
          setExpsense({ labels: monthsLabels, data: getTotals(monthsLabels, items)})
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
      getExpenses()
      },[])

    return (
        <div className="w-11/12 text-white inline-block">
        {expenses?.data && expenses?.labels &&
         <Line data={{
            labels: expenses?.labels,
            datasets: [{
                data: expenses?.data,
                borderColor: '#57a84fff',    
                label: 'Expenses'
            },
           ]
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

export default ExpensesLineChartPanel;
