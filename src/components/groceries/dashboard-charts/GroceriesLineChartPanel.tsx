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
import { ExpenseItem, GroceryItem } from '@/model/models';
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

interface GroceriesLineChartPanelProps{
  filteredGroceries: GroceryItem[]
}


function GroceriesLineChartPanel(props: GroceriesLineChartPanelProps){
    const {filteredGroceries} = props;
    const [groceries,setGroceries] = useState<{labels: string[], data: number[]}>();
    const [discountedGroceries,setDiscountedGroceries] = useState<{labels: string[], data: number[]}>();
    const [allGroceries, setAllGroceries] = useState<ExpenseItem[]>();


    useEffect(()=>{
      if(filteredGroceries){
        console.log('filtered', filteredGroceries);
        
        const monthSet = new Set<string>();
          const items = getItemsInOrder(filteredGroceries);
          setAllGroceries(filteredGroceries)
          items.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
              e.actualAmount = Number(e.actualAmount)
          })
          const monthsLabels = Array.from(monthSet)
          setGroceries({ labels: monthsLabels, data: getTotals(monthsLabels, items)})
          setDiscountedGroceries({ labels: monthsLabels, data: getTotals(monthsLabels, items, true)})
      }
    }, [filteredGroceries])

    function getGroceries(){
      db.groceries
      .toArray()
      .then((ex)=> {
          const monthSet = new Set<string>();
          const items = getItemsInOrder(ex);
          setAllGroceries(ex)
          items.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year)
              e.actualAmount = Number(e.actualAmount)
          })
          const monthsLabels = Array.from(monthSet)
          setGroceries({ labels: monthsLabels, data: getTotals(monthsLabels, items)});
          setDiscountedGroceries({ labels: monthsLabels, data: getTotals(monthsLabels, items, true)})
      });
    }

    function getTotals(monthsLabels: string[], data: any[],hasDiscount?: boolean){
      const totals = []
      for (let i = 0; i< monthsLabels.length; i++) {
        const item = monthsLabels[i];

        const filtered = data.filter((e)=>  months[Number(e.month)-1] + " " + e.year === item)
          .map((e)=> {
            if(!hasDiscount) return Number(e.actualAmount)
            return Number(e.actualAmount) - (Number(e.discountAmount) || 0)
          });

        if(filtered){
          const total = filtered.reduce((a,b)=> Number(a)+Number(b))
          totals.push(total);
        }
      }
      return totals;
    }

    useEffect(()=>{
      getGroceries()
      },[])

    return (
        <div className="w-11/12 text-white inline-block">
        {groceries?.data && groceries?.labels &&
         <Line data={{
            labels: groceries?.labels,
            datasets: [{
                data: groceries?.data,
                borderColor: '#914dc9ff',    
                label: 'Groceries'
            },{
              data: discountedGroceries?.data,
              borderColor: '#58ff49ff',    
              label: 'Groceries (Discounted)'
            }
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

export default GroceriesLineChartPanel;
