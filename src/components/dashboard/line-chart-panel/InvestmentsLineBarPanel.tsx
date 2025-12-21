import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { db } from "@/config/database.config";
import { getItemsInOrder, graphColors, months } from "@/util/utils";
import { Line } from "react-chartjs-2";
import { InvestmentItem } from "@/model/models";
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function InvestemetsLineBarPanel() {
  const [monthsLabels, setMonthsLabels] = useState<string[]>([]);
  const [datasets, setDataSets] = useState<any[]>([]);

  function getInvestments() {
    db.investments.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);

      const itemLabels = new Set<string>();
      let filteredExpenses: InvestmentItem[] = [];

      items.forEach((e) => {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        itemLabels.add(e.description);
        e.actualAmount = Number(e.actualAmount);
      });
      filteredExpenses = items;
      const monthL = Array.from(monthSet);
      setMonthsLabels(monthL);

      const allItems = [];
      for (let index = 0; index < Array.from(itemLabels).length; index++) {
        const item = Array.from(itemLabels)[index];
                  const data = filteredExpenses.filter((e) => e.description === item);
        console.log("Item", item);
        console.log("Data", data);
        const totals: number[] = [];
        console.log(monthL);
        const color =  graphColors[index+1];
        monthL.forEach((month) => {
          const monthTotal = data.filter(
            (e) => months[Number(e.month) - 1] + " " + e.year === month
          );
          if (monthTotal.length) {
            totals.push(monthTotal[0].actualAmount);
          } else {
            totals.push(0);
          }
        });
        console.log(" Totals", totals);

        const ep = {
          data: [...totals],
          borderColor: color,
          label: item,
        };
        allItems.push(ep);
      }
     
      setDataSets([...allItems]);
    });
  }

  useEffect(() => {
    getInvestments();
  }, []);

  return (
    <div className="text-white inline-block" style={{ width: "100%" }}>
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
                text: "Past Budget Totals By Category Overview",
                color: "white",
              },
            },
          }}
          style={{ color: "white", width: "100%" }}
        />
      )}
    </div>
  );
}

export default InvestemetsLineBarPanel;
