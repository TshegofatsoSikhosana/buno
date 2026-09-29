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
import { getItemsInOrder, months } from '@/util/utils';
import { Line } from 'react-chartjs-2';
import { BusinessItem } from '@/model/models';
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

function BusinessLineBarPanel({selectedBusiness} : {selectedBusiness : BusinessItem}){
    const [expenses,setExpsense] = useState<{labels: string[], data: number[]}>();
    const [incomes,setIncomes] = useState<{labels: string[], data: number[]}>();
    const [loading, setLoading] = useState<boolean>(true);

    function getExpenses(){
      const monthSet = new Set<string>();
      const items = getItemsInOrder(selectedBusiness.expenseItems || []);
      
      items.forEach((e)=>{
          monthSet.add(months[Number(e.month)-1]+ " " + e.year)
          e.amount = Number(e.amount)
      });

      const monthsLabels = Array.from(monthSet)
      setExpsense({ labels: monthsLabels, data: getTotals(monthsLabels, items)})
    }

    function getIncomes(){
      const monthSet = new Set<string>();
      const items = getItemsInOrder(selectedBusiness.incomeItems || []);
      items.forEach((e)=>{
          monthSet.add(months[Number(e.month)-1]+ " " + e.year)
          e.amount = Number(e.amount)
      })
      const monthsLabels = Array.from(monthSet)
      setIncomes({ labels: monthsLabels, data: getTotals(monthsLabels, items)})
    }

    function getTotals(monthsLabels: string[], data: any[], isGroceries?: boolean){
      const totals = []
      for (let i = 0; i< monthsLabels.length; i++) {
        const item = monthsLabels[i];

        const filtered = data.filter((e)=>  months[Number(e.month)-1] + " " + e.year === item)
          .map((e)=> {
            return Number(e.amount)
          });

        if(filtered){
          const total = filtered.reduce((a,b)=> Number(a)+Number(b))
          totals.push(total);
        }
      }
      return totals;
    }

    useEffect(()=>{
      if(selectedBusiness){
        getExpenses()
        getIncomes()
      }
    },[selectedBusiness]);

    useEffect(()=>{
      if(expenses && incomes){
        setLoading(false);
      }
    }, [expenses, incomes]);

    return (
        <div className="w-11/12 text-white inline-block">
        {!loading &&
         <Line data={{
            labels: expenses?.labels,
            datasets: [{
                data: expenses?.data,
                borderColor: '#c5003bff',    
                label: 'Expenses'
            },
            {
                data: incomes?.data,
                borderColor: 'rgba(0, 189, 85, 1)',
                label: 'Income'    
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

export default BusinessLineBarPanel;
