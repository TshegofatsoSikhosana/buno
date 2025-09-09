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
import { graphColors, months } from '@/util/utils';
import { Line } from 'react-chartjs-2';
import { ExpenseCategory, Store } from '@/model/models';
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );


interface ExpenseLineBarPanelProps{
  filterType?: Store
}
function GroceriesLineBarPanel(props: ExpenseLineBarPanelProps){
  const {filterType} = props;
    const [expenses,setExpsense] = useState<{labels: string[], data: number[]}>();
    const [monthsLabels,setMonthsLabels] = useState<string[]>([]);
    const [datasets, setDataSets] = useState<any[]>([])
  function randomColor(){
    let color = '#'
    const tokens = 'abcdef012345678'.split('');


    for(let i = 0 ; i< 6; i++){
        const t = tokens[Math.floor(Math.random()*15)]      
        if(t)
        color = color + t;
    }
    return `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
   }
    function getExpenses(){
      db.groceries
      .toArray()
      .then((ex)=> {
          const monthSet = new Set<string>();
          const itemLabels = new Set<string>();
          let filteredExpenses = []
          
          if(filterType || filterType === 0){
            const expenses = ex.filter((ex)=> ex.store === filterType);
            expenses.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year);
              itemLabels.add(e.description)
              e.actualAmount = Number(e.actualAmount)
            })
            filteredExpenses = expenses;
          }else{
            ex.forEach((e)=>{
              monthSet.add(months[Number(e.month)-1]+ " " + e.year);
              itemLabels.add(e.description)
              e.actualAmount = Number(e.actualAmount)
          })
            filteredExpenses = ex;
          }
          const monthL = Array.from(monthSet)
          setMonthsLabels(monthL);

          const allItems = []
          itemLabels.forEach(item=>{
            const data = filteredExpenses.filter(e=> e.description === item);
            console.log('Item', item);
            console.log('Data', data)
            const totals = [];
            console.log(monthL);
            
            monthL.forEach(month=>{
              const monthTotal = data.filter((e)=>  months[Number(e.month)-1] + " " + e.year === month);
              if(monthTotal.length){
                totals.push(monthTotal[0].actualAmount);
              }else{
                totals.push(undefined);
              }
            })
            console.log(" Totals", totals);

            const ep = {
                data: [...totals],
                borderColor: randomColor(),    
                label: item
            }
            allItems.push(ep)
          })
          // console.log("Expesees", allItems);
          setDataSets([...allItems])

      });
    }

    useEffect(()=>{
      console.log('Type', filterType);
      
      getExpenses()
      },[filterType])

    return (
        <div className="text-white inline-block"  style={{width: '100%'}}>
        {datasets.length && monthsLabels &&
         <Line data={{
          labels: monthsLabels,
            datasets: [...datasets]
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
            style={{color: "white", width:'100%'}}/>}
    </div>
    );
}

export default GroceriesLineBarPanel;
