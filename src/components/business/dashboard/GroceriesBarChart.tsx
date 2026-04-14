import { ExpenseItem, GroceryItem, Store } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { db } from '@/config/database.config';
import BarChart from '../../shared/charts/BarChart';
import GroceriesLineBarPanel from '@/components/groceries/dashboard-charts/GroceriesLineBarPanel';
import { getItemsInOrder, months } from '@/util/utils';
import HorizontalBarChart from '@/components/shared/charts/HorizontalBarChart';


const GroceriesBarChart = () => {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const year = useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);
  const [isTotalsView, setIsTotalsView] = useState(false);
  const [filterType, setFilterType] = useState<Store | undefined>();
  const [expense, setExpense] = useState<any>([]);


  useEffect(() => {
    getGroceries();
    getGroceriesTotals();
  }, [year, month]);


  useEffect(() => {
    console.log('expenses', expense);

  }, [expense])
  function getGroceries() {
    db.groceries.where({ year: year })
      .and((i) => Number(i.month) == month)
      .toArray()
      .then((ex) => {
        setGroceries(ex.sort((a, b) => b.actualAmount - a.actualAmount));
      });
  }


  function getGroceriesTotals() {
    db.businessIncomeEntry
      .toArray()
      .then((ex) => {
        const monthSet = new Set<string>();
        const items = getItemsInOrder(ex);
        items.forEach((e) => {
          if (months[Number(e.month) - 1]) {
            monthSet.add(months[Number(e.month) - 1] + " " + e.year)
          }
        })
        const monthsLabels = Array.from(monthSet)
        setExpense({ labels: monthsLabels, data: getTotals(monthsLabels, items) })
      });
  }

  function getTotals(monthsLabels: string[], data: any[],) {
    const totals = []
    for (let i = 0; i < monthsLabels.length; i++) {
      const item = monthsLabels[i];

      const filtered = data.filter((e) => months[Number(e.month) - 1] + " " + e.year === item)
        .map((e) => Number(e.amount));

      if (filtered) {
        const total = filtered.reduce((a, b) => Number(a) + Number(b))
        totals.push(total);
      }
    }
    return totals;
  }
  return (
    <>
      <div>
        <div className="inline w-4/12 p-2">
        </div>
      </div>
      {expense &&
        <>
          {!isTotalsView ?
            <HorizontalBarChart
              labels={expense.labels}
              data={expense.data}
              title="Business Incomes"
              horizontal={false} />
            : <div className='text-white inline-block' style={{ width: '100%' }}>
              <GroceriesLineBarPanel filterType={filterType} />
            </div>
          }</>
      }
    </>
  );
}

export default GroceriesBarChart;
