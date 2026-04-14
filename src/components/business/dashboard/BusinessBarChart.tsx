import React, { useEffect, useState } from 'react';
import { BusinessService } from '@/service/BusinessService';
import { useSelector } from 'react-redux';
import { budgetSelectors } from '@/store';
import { getAmountTotal, filterByMonthAndYear, getItemsInOrder, months } from '@/util/utils';
import { BusinessItem, BusinessIncomeItem } from '@/model/models';
import HorizontalBarChart from '@/components/shared/charts/HorizontalBarChart';
import { db } from '@/config/database.config';

export default function BusinessBarChart() {
    const year = useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
    const [expense, setExpense] = useState<any>([]);

    useEffect(() => {
        const businessService = new BusinessService();
        businessService.getBusinesses().then((res) => {
            setBusinesses(res);
        });
    }, [year, month]);

    function getGroceries() {
        db.businessExpenseEntry
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
                .map((e) => Number(e.actualAmount));

            if (filtered) {
                const total = filtered.reduce((a, b) => Number(a) + Number(b))
                totals.push(total);
            }
        }
        return totals;
    }



    const labels = businesses.map(b => b.name);
    const data = businesses.map(b => {
        const incomes = b.incomeItems as BusinessIncomeItem[] || [];
        return getAmountTotal(incomes);
    });

    if (businesses.length === 0) {
        return <div className="text-white p-4">No business data available.</div>;
    }

    return (
        <div className="w-11/12 text-white inline-block mt-5">
            <HorizontalBarChart
                labels={labels}
                data={data}
                title={`Business Income`}
                horizontal={false}
            />
        </div>
    );
}
