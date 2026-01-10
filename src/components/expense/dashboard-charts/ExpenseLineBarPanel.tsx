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
import { ExpenseCategory, ExpenseItem } from "@/model/models";
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
  const itemLabels = [
    "Living Expenses",
    "Personal Expenses",
    "Exception Expenses",
  ];
  const [avgPersonalExpenses, setAvgPersonalExpenses] = useState<number>(0);
  const [avgLivingExpenses, setAvgLivingExpenses] = useState<number>(0);
  const [avgExceptions, setAvgExceptions] = useState<number>(0);

  function getExpenses() {
    db.expenses.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      let filteredExpenses: ExpenseItem[] = [];

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
        

        const ep = {
          data: [...totals],
          borderColor: color,
          label: itemLabels[item],
        };
        console.log(" Totals",  totals.reduce((a, b) => a + b) );
        const avg = totals.reduce((a, b) => a + b) / monthL.length;
        if (item === 0) {
          setAvgLivingExpenses(Math.round(avg));
        } else if (item === 1) {
          setAvgPersonalExpenses(Math.round(avg));
        } else {
          setAvgExceptions(Math.round(avg));
        }
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
      <>
        <div className="w-100 p-5">
          <div
            className="inline-block w-3/12"
            style={{ padding: "3rem", borderRadius: "10px" }}
          >
            <h1>Total Category Averages:</h1>
            <div> </div>
          </div>
          <div
            className="inline-block mr-5 w-2/12"
            style={{
              border: "2px solid rgba(222,222,222,0.5)",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <h1>Living Expenses</h1>
            <div>R{avgLivingExpenses}</div>
          </div>
          <div
            className="inline-block mr-5 w-2/12"
            style={{
              border: "2px solid rgba(222,222,222,0.5)",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <h1>Personal</h1>
            <div>R{avgPersonalExpenses}</div>
          </div>

          <div
            className="inline-block mr-5  w-2/12"
            style={{
              border: "2px solid rgba(222,222,222,0.5)",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <div>Exceptions</div>
            <div>R{avgExceptions}</div>
          </div>

          {/* <div  className='inline-block mr-5 w-2/12' style={{border:'2px solid rgb(30,150,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
              <div>Income</div>
              <div>R{avgIncomes}</div>
            </div> */}
        </div>
      </>
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
