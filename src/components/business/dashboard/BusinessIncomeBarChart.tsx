import { BusinessItem, Store } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import GroceriesLineBarPanel from '@/components/groceries/dashboard-charts/GroceriesLineBarPanel';
import { getItemsInOrder, months } from '@/util/utils';
import HorizontalBarChart from '@/components/shared/charts/HorizontalBarChart';


function BusinessIncomeBarChart({selectedBusiness} : {selectedBusiness : BusinessItem}) {
  const year = useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);
  const [isTotalsView, setIsTotalsView] = useState(false);
  const [filterType, setFilterType] = useState<Store | undefined>();
  const [incomes, setIncomes] = useState<any>([]);


  useEffect(() => {
    if(selectedBusiness){
    getIncomeTotals();
    }
  }, [year, month, selectedBusiness]);

  function getIncomeTotals() {
    const monthSet = new Set<string>();
    const items = getItemsInOrder(selectedBusiness.incomeItems || []);
    items.forEach((e) => {
      if (months[Number(e.month) - 1]) {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year)
      }
    })
    const monthsLabels = Array.from(monthSet)
    setIncomes({ labels: monthsLabels, data: getTotals(monthsLabels, items) })
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
      {incomes &&
        <>
          {!isTotalsView ?
            <HorizontalBarChart
              labels={incomes.labels}
              data={incomes.data}
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

export default BusinessIncomeBarChart;
