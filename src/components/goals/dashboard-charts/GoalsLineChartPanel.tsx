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
import { getItemsInOrder, graphColors, months } from '@/util/utils';
import { Line } from 'react-chartjs-2';
import { GoalsService } from '@/service/GoalsService';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

function GoalsLineBarPanel(){

  const goalsService = new GoalsService();
  const year = useSelector(budgetSelectors.getCurrentYear);
  const [monthsLabels, setMonthsLabels] = useState<string[]>([]);
  const [datasets, setDataSets] = useState<any[]>([]);

  async function getGoals() {
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
    const monthL = Array.from(monthSet);
    setMonthsLabels(monthL);

    const allItems = [];
    for (let i = 0; i < Array.from(itemLabels).length; i++) {
      const item = Array.from(itemLabels)[i];
      const data = filteredEntries.filter((e) => e.label === item);

      const totals: number[] = [];
      const color =  graphColors[i];
      monthL.forEach((month) => {
        const monthTotal = data.filter(
          (e) => months[Number(e.month) - 1] + " " + e.year === month
        );
        if (monthTotal.length) {
          totals.push(monthTotal[0].amount);
        } else {
          totals.push(0);
        }
      });

      const goalData = {
        data: [...totals],
        borderColor: color,
        label: item,
      };
      allItems.push(goalData);
    }

    setDataSets([...allItems]);
  }

    useEffect(()=>{
      getGoals()
      },[])

    return (
        <div className="w-11/12 text-white inline-block">
        {datasets.length && monthsLabels && (
                <Line
                  data={{
                    labels: monthsLabels,
                    datasets: [...datasets],
                  }}
                  options={{
                    layout: { padding: 2 },
                    color: "white",
                    scales: {},
                    elements: {
                      bar: {
                        borderWidth: 2,
                      },
                    },
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "right" as const,
                        display: true,
                        labels: {
                          color: "white",
                        },
                      },
                      title: {
                        display: true,
                        text: "Goal Totals Monthly Overview",
                        color: "white",
                      },
                    },
                  }}
                  style={{ color: "white", width: "100%" }}
                />)}
    </div>
    );
}

export default GoalsLineBarPanel;
