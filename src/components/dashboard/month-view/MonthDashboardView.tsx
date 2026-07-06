"use client";
import { db } from "@/config/database.config";
import { budgetSelectors } from "@/store";
import { getItemsInOrder, months } from "@/util/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function MonthDashboardView() {
  const [groceries, setGroceries] = useState<{
    labels: string[];
    data: number[];
  }>();
  const [expenses, setExpsense] = useState<{
    labels: string[];
    data: number[];
  }>();
  const [investments, setInvestments] = useState<{
    labels: string[];
    data: number[];
  }>();
  const [income, setIncome] = useState<{ labels: string[]; data: number[] }>();
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const year = useSelector(budgetSelectors.getCurrentYear);
  const [monthTotals, setMonthTotals] = useState<{year: number, month: string, total: number}[]>([]);
  const [monthTotalsOverview, setMonthTotalsOverview] = useState<{year: number, month: string, total: number}[]>([]);
  function getGroceries() {
    db.groceries.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      items.forEach((e) => {
        if (months[Number(e.month) - 1]) {
          monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        }
      });
      const monthsLabels = Array.from(monthSet);
      items.forEach((e) => {
        if(e.actualAmount && e.discountAmount){
        e.actualAmount = Number(e.actualAmount) - Number(e.discountAmount);
        }
      });
      setGroceries({
        labels: monthsLabels,
        data: getTotals(monthsLabels, items),
      });
    });
  }

  function getIncome() {
    db.income.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      items.forEach((e) => {
        if (months[Number(e.month) - 1]) {
          monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        }
      });
      const monthsLabels = Array.from(monthSet);
      setIncome({ labels: monthsLabels, data: getTotals(monthsLabels, items) });
    });
  }

  function getExpenses() {
    db.expenses.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      items.forEach((e) => {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        e.actualAmount = Number(e.actualAmount);
      });
      const monthsLabels = Array.from(monthSet);
      const years = new Set<number>(
        monthsLabels.map((g) => Number(g.split(" ")[1])),
      );
      setYears(Array.from(years.values()).sort((a, b) => b - a));
      setExpsense({
        labels: monthsLabels,
        data: getTotals(
          monthsLabels,
          items.filter((e) => e.description.toLowerCase() !== "groceries"),
        ),
      });
    });
  }

  function getInvestments() {
    db.investments.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      items.forEach((e) => {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        e.actualAmount = Number(e.actualAmount);
      });
      const monthsLabels = Array.from(monthSet);
      setInvestments({
        labels: monthsLabels,
        data: getTotals(monthsLabels, items),
      });
    });
  }

  function getTotals(monthsLabels: string[], data: any[]) {
    const totals = [];
    for (let i = 0; i < monthsLabels.length; i++) {
      const item = monthsLabels[i];

      const filtered = data
        .filter((e) => months[Number(e.month) - 1] + " " + e.year === item)
        .map((e) => Number(e.actualAmount));

      if (filtered) {
        const total = filtered.reduce((a, b) => Number(a) + Number(b));
        totals.push(total);
      }
    }
    return totals;
  }

  useEffect(() => {
    getGroceries();
    getExpenses();
    getInvestments();
    getIncome();
    setSelectedYear(year);
  }, []);

  useEffect(() => {
    if (groceries && expenses && investments && income) {
      getMonthTotals();
    }
  }, [groceries, expenses, investments, income]);

  useEffect(() => {
      console.log('monthTotals', monthTotals);

    if (monthTotals && monthTotals.length > 0) {
      addOverviewData();
    }
  }, [monthTotals]);

  function getMonthTotals() {

    let totalmonths: {
      month: string;
      year: number;
      total: number;
    };
    let all: any[] =[]
    const monthSet = years.map((year) => {
      return {
        year: year,
        months: months.map((m) => m.toLowerCase() + " " + year),
      };
    });

    monthSet.forEach((set) => {
      set.months.forEach((m) => {
        let totalGroceries = 0;
        let totalExpenses = 0;
        let totalInvestments = 0;
        let totalIncomes = 0;
        groceries?.labels.forEach((g, i) => {
          if (g.toLowerCase() === m) {
            totalGroceries = groceries.data[i];
          }
        });
        expenses?.labels.forEach((g, i) => {
          if (g.toLowerCase() === m) {
            totalExpenses = expenses.data[i];
          }
        });
        investments?.labels.forEach((g, i) => {
          if (g.toLowerCase() === m) {
            totalInvestments = investments.data[i];
          }
        });
        income?.labels.forEach((g, i) => {
          if (g.toLowerCase() === m) {
            totalIncomes = income.data[i];
          }
        });

        const total = totalIncomes - totalGroceries - totalExpenses - totalInvestments;
        totalmonths = {
          month: m,
          year: set.year,
          total: total,
        };
        all.push(totalmonths)
      });

      
      setMonthTotals(all);
    //  console.log('all', all);
     
    });
  }

  function addOverviewData() {
    const all: any = []
    
    months.forEach((month) => {

          const total = monthTotals.filter(a => a.month.split(" ")[0].toLowerCase().trim() === month.toLowerCase())
          .map((a)=> a.total)
                .reduce((p,c)=> Number(p) + Number(c), 0);

            
                

        const monthTotal = {
          month: month,
          year: 0,
          total: total,
        };
        all.push(monthTotal)
        })
      
    setMonthTotalsOverview(all);
  }

  return (
    <div className="w-100 p-5 dashboard-container">
        <div className="w-100 mb-2">
      <select
        className="text-black p-2 inline-block mr-5 w-2/12 total-card"
        style={{ borderRadius: "5px", backgroundColor: "white" }}
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        <option value={0} key={-1}>
        All years</option>
        {years.map((y, i) => (
          <option value={y} key={i}>
            {y}
          </option>
        ))}
      </select>
      </div>
      {selectedYear && selectedYear > 0 ? <>{monthTotals.filter((m) => m.year === selectedYear).map((m, i) => (
        <>
          <div
            className="w-2/12 text-center grid-flow-row p-2 font-bold inline-block"
            style={{
              border: "2px solid rgba(222,222,222,0.5)",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: `${m.total > 0 ? 'rgb(19, 88, 51)' : Number(m.total) !== 0 ? 'rgb(109, 14, 14)' : ''}`,
            }}
          >
            <h1>{months.filter((_, i) => _.toLowerCase() === m.month.split(" ")[0]).pop()}</h1>
            <div>R{m.total.toFixed(2)}</div>
          </div>
        </>
      ))}</> : <>{monthTotalsOverview.map((m, i) => (
        <>
          <div
            key={i}
            className="w-2/12 text-center grid-flow-row p-2 font-bold inline-block"
            style={{
              border: "2px solid rgba(222,222,222,0.5)",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: `${m.total > 0 ? 'rgb(19, 88, 51)' : Number(m.total) !== 0 ? 'rgb(109, 14, 14)' : ''}`,
            }}
          >
            <h1>{m.month}</h1>
            <div>R{m.total.toFixed(2)}</div>
          </div>
        </>
      ))}
      </>}
    </div>
  );
}

export default MonthDashboardView;
