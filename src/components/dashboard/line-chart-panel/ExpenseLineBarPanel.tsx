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
import {
  getActualTotal,
  getItemsInOrder,
  graphColors,
  months,
} from "@/util/utils";
import { Line } from "react-chartjs-2";
import { ExpenseCategory } from "@/model/models";
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface ExpenseLineBarPanelProps {
  filterType?: ExpenseCategory;
}
function ExpenseLineBarPanel(props: ExpenseLineBarPanelProps) {
  const { filterType } = props;
  const [monthsLabels, setMonthsLabels] = useState<string[]>([]);
  const [datasets, setDataSets] = useState<any[]>([]);

  function getExpenses() {
    db.expenses.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      const itemLabels = new Array<string>();

      itemLabels.push("Living Expenses");
      itemLabels.push("Personal Expenses");
      itemLabels.push("Exception Expenses");
      let filteredExpenses = [];

      items.forEach((e) => {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        e.actualAmount = Number(e.actualAmount);
      });
      filteredExpenses = items;

      const monthL = Array.from(monthSet);
      setMonthsLabels(monthL);

      const allItems: any[] = [];
      const itemLabelArray = [0, 1, 2];
      itemLabelArray.forEach((item) => {
        const data = filteredExpenses.filter((e) => e.category === item);
        console.log("Item", itemLabels[item]);
        console.log("Data", data);
        const totals: number[] = [];
        console.log(monthL);
        const color = graphColors[item + 3];

        monthL.forEach((month) => {
          const monthTotal = data.filter(
            (e) => months[Number(e.month) - 1] + " " + e.year === month
          );
          if (monthTotal.length) {
            totals.push(getActualTotal(monthTotal));
          } else {
            totals.push(0);
          }
        });
        console.log(" Totals", totals);

        const ep = {
          data: [...totals],
          borderColor: color,
          label: itemLabels[item],
        };
        allItems.push(ep);
      });
      // console.log("Expesees", allItems);
      setDataSets([...allItems]);
    });
  }

  useEffect(() => {
    console.log("Type", filterType);

    getExpenses();
  }, [filterType]);

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

export default ExpenseLineBarPanel;
