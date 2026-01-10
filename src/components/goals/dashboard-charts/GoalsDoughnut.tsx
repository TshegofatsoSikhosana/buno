import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import DoughnutChart from '../../dashboard/doughnuts/DoughnutChart';
import { GoalsService } from '@/service/GoalsService';
import { getItemsInOrder, graphColors, months } from '@/util/utils';


const GoalsDoughnut = () => {

    const goalsService = new GoalsService();
    const [goals,setGoals] = useState<any[]>([]);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    useEffect(()=>{
        getGoals();
    },[year,month]);
    
    async function getGoals(){
      const goals = await goalsService.getGoals(year);
      let goalEntries: any[] = [];
  
      goals.forEach((goal) =>{
        if(goal.entries){
          goal.entries.forEach((entry)=>{
              goalEntries.push( {
                  year: Number(entry.year),
                  month: Number(entry.month),
                  amount: entry.amount,
                  label: goal.name
              })
          });
        }
      })
  
      const monthSet = new Set<string>();
      const items = getItemsInOrder(goalEntries);
      const itemLabels = new Set<string>();
  
      let filteredEntries: any[] = [];
      items.forEach((e) => {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        itemLabels.add(e.label);
        e.amount = Number(e.amount);
      });
      filteredEntries = items;
  
      const allItems = [];
      for (let i = 0; i < Array.from(itemLabels).length; i++) {
        const item = Array.from(itemLabels)[i];
        const data = filteredEntries.filter((e) => e.label === item);

        let total: number = getTotal(data);
        const goalData = {
          amount: total || 0 ,
          label: item,
        };
        allItems.push(goalData);
      }
     
      const target = goalsService.getExpectedTotal(goals);
      const remainder = target - getTotal(allItems);
       allItems.push({
        amount: remainder,
        borderColor: graphColors[allItems.length + 1],
        label: 'Remainder'
      });

      setGoals(allItems);
    }

    function getTotal(allItems: any[]){
      let total = 0;
      for (let i = 0; i < allItems.length; i++) {
        const element = allItems[i];
        total +=  isNaN(element.amount) ? 0 : element.amount;
      }
      return total;
    }

    return (
      <>
        {goals && <DoughnutChart
                      values={[...goals.map(goal => goal.amount)]}
                      labels={[...goals.map(goal => goal.label)]}/>
      }
      </>
    );
}

export default GoalsDoughnut;
