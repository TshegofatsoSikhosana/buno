'use client'
import { filterByMonthAndYear, getAmountTotal, getExpectedTotal, getMonth } from "@/util/utils"
import ProgressBar from "../../shared/ProgressBar"
import { BusinessIncomeItem, BusinessItem } from "@/model/models";
import RowActions from "../../shared/RowActions";
import { useState } from "react";
import { BusinessService } from "@/service/BusinessService";
import IncomeItemEditForm from "./IncomeItemEditForm";
import { useAppSelector } from "@/store/hooks";
import { budgetSelectors } from "@/store";


interface BusinessIncomesType {
    business: BusinessItem;
    entryIndex: number,
    getBusinessEntries: () => void,
}


export default function BusinessIncomes({ business, entryIndex, getBusinessEntries }: BusinessIncomesType) {

    const [selectedPaymentItem, setSelectedPaymentItem] = useState<BusinessIncomeItem | null>(null);
    const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(-1);
    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const [selectedPaymentEntryIndex, setSelectedPaymentEntryIndex] = useState<number>(-1);
    const businessService = new BusinessService();
    const year = useAppSelector(budgetSelectors.getCurrentYear);
    const month = useAppSelector(budgetSelectors.getCurrentMonth);

    function openPayementForm(index: number, payment?: BusinessIncomeItem) {
        if (payment) {
            setSelectedEntryIndex(index + 1);
            setSelectedPaymentItem({ ...payment });
        } else {
            setSelectedPaymentEntryIndex(-1);
            setSelectedPaymentItem(null);
        }
        setOpenPaymentForm(true);
    }


    function getPaymentPercentage(payments: BusinessIncomeItem[]) {
        return Number((getAmountTotal(payments as BusinessIncomeItem[]) / getExpectedTotal(payments as BusinessIncomeItem[]) * 100).toFixed(2)) || 0
    }

    function deleteItem(index: number) {
        // if (expectedEntries && Number(selectedEntryIndex) >= 0) {
        //     businessService.deleteEntry(Number(expectedEntries[index].id))
        //     getBusinessEntries();
        // }
    }

    return <div key={entryIndex}>

        <div className="p-2">
            <div className="w-100 mt-5 mb-2">
                <button
                    className="p-2 mb-2 btn-add"
                    onClick={(e) => openPayementForm(entryIndex)}
                >
                    Add Payment
                </button>
            </div>
            <div className='w-11/12 grid-flow-row inline-block' >
                <div className='w-6/12 p-2 inline-block' >
                    <ProgressBar percentageComplete={getPaymentPercentage(filterByMonthAndYear(business?.incomeItems as BusinessIncomeItem[], year, month))} />
                </div>

                <div className='w-3/12 p-2 inline-block font-bold text-center' style={{ border: '2px solid rgb(70, 70, 80,180)', color: 'rgb(30,150,222,255)' }} >
                    Expected
                </div>
                <div className='w-3/12 p-2 inline-block font-bold text-center' style={{ border: '2px solid rgb(70, 70, 80,180)', color: 'rgb(30,150,222,255)' }} >
                    Actual
                </div>
            </div>
            <div className='w-11/12 grid-flow-row inline-block mb-2'>
                <div className='w-2/12 p-2 inline-block text-center' > </div>
                <div className='w-4/12 p-2 inline-block text-start font-bold' >

                </div>
                <div className='w-3/12 p-2 inline-block text-start font-bold' style={{ border: '2px solid rgb(70, 70, 80,180)', color: 'rgb(30,150,222,255)' }} >
                    R{getExpectedTotal(filterByMonthAndYear(business?.incomeItems as BusinessIncomeItem[], year, month))}
                </div>
                <div className='w-3/12 p-2 inline-block text-start font-bold' style={{ border: '2px solid rgb(70, 70, 80,180)', color: 'rgb(30,150,222,255)' }} >
                    R{getAmountTotal(filterByMonthAndYear(business?.incomeItems as BusinessIncomeItem[], year, month))}
                </div>
            </div>
            {filterByMonthAndYear(business?.incomeItems as BusinessIncomeItem[], year, month).map((payment, index) => {
                return <div className='w-11/12 grid-flow-row row-text-block'
                    style={{ border: '1px solid rgb(70, 70, 80,180)' }}
                    key={index}
                    onClick={(e) => setSelectedPaymentEntryIndex(index + 1)}
                    onMouseLeave={(e) => setSelectedPaymentEntryIndex(-1)}>
                    <div className='w-2/12 inline-block text-center' >
                        {Number(selectedPaymentEntryIndex) - 1 === index ?
                            (<RowActions deleteItem={deleteItem} setOpenForm={() => openPayementForm(index, payment)} index={index} />)
                            : <></>
                        }
                    </div>
                    {/* <div className='w-2/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{entry.id}</div> */}
                    <div className='w-4/12 p-2 inline-block text-start' style={{ borderLeft: '2px solid rgb(70, 70, 80,180)' }}> {payment.description}</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{ borderLeft: '2px solid rgb(70, 70, 80,180)' }}> R{payment.expectedAmount}</div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{ borderLeft: '2px solid rgb(70, 70, 80,180)' }}> R{payment.amount}</div>
                </div>
            })}
        </div>
        <IncomeItemEditForm item={selectedPaymentItem} open={openPaymentForm} setOpen={setOpenPaymentForm} refresh={getBusinessEntries} businessItem={business} />

    </div>

}