'use client'
import BusinessIncomes from "@/components/business/entries/BusinessIncomes";
import { BusinessItem } from "@/model/models";
import { isTabActive, Tab } from "@/model/shared";
import { BusinessService } from "@/service/BusinessService";
import { getMonth } from "@/util/utils";
import { useEffect, useState } from "react";
import BusinessExpense from "./BusinessExpense";
import { useSelector } from "react-redux";
import { budgetActions, budgetSelectors } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import BusinessDashboard from "../dashboard/BusinessDashboard";


interface EntriesProps {
    selectedBusiness: BusinessItem,
    refresh: () => void
}

export default function EntriesTab({ selectedBusiness, refresh }: EntriesProps) {

    const businessService = new BusinessService();
    const year = useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const dispatch = useAppDispatch();

    const [openForm, setOpenForm] = useState(false);
    const [active, setActive] = useState<Tab>(Tab.BUSINESS_EXPENSE);

    const [hasErrors, setHasErrors] = useState<boolean>(true);

    useEffect(() => {
        getBusinessEntries();

    }, [selectedBusiness]);

    function getBusinessEntries() {
        // const target = uberBusinesses.targetAmount ? Number(uberBusinesses.targetAmount) : 0;
        // businessService.getBusinessEntries(selectedBusiness?.id as number).then((entries) => {
        //     setExpectedEntries(entries as BusinessExpectedItem[]);
        //     console.log("We here", entries);
        //     // const percentage = props.item && props.item.targetAmount ? Number((total / Number(props.item.targetAmount)) * 100).toFixed(2) : 0;
        //     // setPercentageComplete(Number(percentage));
        // });
    }

    function handleEntryChange(value: number) {
        const newMonth = month + value;
        if (newMonth > 0 && newMonth <= 12) {
            dispatch(budgetActions.setCurrentMonth(newMonth));
        } else if (newMonth === 0) {
            dispatch(budgetActions.setCurrentYear(year - 1));
            dispatch(budgetActions.setCurrentMonth(12));
        } else if (newMonth === 13) {
            dispatch(budgetActions.setCurrentYear(year + 1));
            dispatch(budgetActions.setCurrentMonth(1));
        }
    }

    function renderContent() {
        switch (active) {
            case Tab.BUSINESS_ENTRIES:
                return <BusinessIncomes key={0} business={selectedBusiness as BusinessItem} entryIndex={0} getBusinessEntries={refresh} />
            default:
                return <BusinessExpense key={0} businessItem={selectedBusiness as BusinessItem} entryIndex={0} getBusinessEntries={refresh} />
        }

    }

    return <>
        {!openForm ?
            <>
                <div className='w-100 grid-flow-row' >
                    <div className="w-100">
                        <div style={{
                            // backgroundColor: "rgb(22, 26, 43)",
                            borderBottom: '2px solid white',
                            borderTop: '2px solid white',
                            color: 'white',
                        }}
                            className="mt-2 p-2">
                            <button className="inline-block w-2/12" onClick={() => handleEntryChange(-1)} style={{ cursor: 'pointer' }}>{'<'}</button>
                            <div className="inline-block w-8/12 text-center">{getMonth(month)} {year}</div>
                            <button className="inline-block w-2/12" onClick={() => handleEntryChange(1)} style={{ cursor: 'pointer' }}>{'>'}</button>
                        </div>

                        <div className='w-100'>
                            <div
                                className={`tab-option inline-block p-4 ${isTabActive(Tab.BUSINESS_EXPENSE, active)}`}
                                onClick={(e) => setActive(Tab.BUSINESS_EXPENSE)}
                            >
                                Expenses
                            </div>
                            <div
                                className={`tab-option inline-block p-4 ${isTabActive(Tab.BUSINESS_ENTRIES, active)}`}
                                onClick={(e) => setActive(Tab.BUSINESS_ENTRIES)}
                            >
                                Income
                            </div>
                        </div>

                        {selectedBusiness && renderContent()}
                </div>
            </div>
            </>
            :
            // <BusinessItemEditForm
            //     getBusinessEntries={getBusinessEntries}
            //     item={selectedItem as BusinessExpectedItem}
            //     selectedBusiness={selectedBusiness as BusinessItem}
            //     setOpenForm={setOpenForm} />
            <></>
        }</>
}