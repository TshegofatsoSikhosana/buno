'use client';
import AddBusinessForm from "@/components/business/AddBusinessForm";
import Entries from "@/components/business/entries/EntriesTab";
import { BusinessItem } from "@/model/models";
import { isTabActive, Tab } from "@/model/shared";
import { BusinessService } from "@/service/BusinessService";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


function Page() {

    const [uberBusiness, setUberBusinesses] = useState<BusinessItem>();


    const year = useSelector(budgetSelectors.getCurrentYear);
    const businessService = new BusinessService();

    const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(null);
    const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
    const [entriesTotal, setEntriesTotal] = useState<number>(0);
    const [paymentsTotal, setPaymentsTotal] = useState<number>(0);
    const [active, setActive] = useState<Tab>(Tab.BUSINESS_ENTRIES);


    useEffect(() => {
        getBusinesses();
    }, [businesses]);



    function getBusinessEntries() {
        // const target = uberBusinesses.targetAmount ? Number(uberBusinesses.targetAmount) : 0;
        // businessService.getBusinessEntries(1).then((entries) => {
        //     const total = businessService.getEntriesTotal(entries);
        //     setEntriesTotal(total);
        //     const paymentsTotal = businessService.getPaymentEntriesTotal(entries);
        //     setPaymentsTotal(paymentsTotal);
        //     // const percentage = props.item && props.item.targetAmount ? Number((total / Number(props.item.targetAmount)) * 100).toFixed(2) : 0;
        //     // setPercentageComplete(Number(percentage));
        // });
    }

    function getBusinesses() {
        if (!selectedBusiness) {
            businessService.getBusinesses().then((business) => {
                setBusinesses(business);
                setSelectedBusiness(business[0]);
            })
        } else {
            businessService.getBusinesses().then((business) => {
                setBusinesses(business);
                setSelectedBusiness(business.filter(business => business.id === selectedBusiness.id)[0]);
            })
        }
    }

    function renderContent() {
        switch (active) {
            case Tab.BUSINESS_ENTRIES:
                return <Entries selectedBusiness={selectedBusiness as BusinessItem} refresh={getBusinesses} />
            default:
                return <Entries selectedBusiness={selectedBusiness as BusinessItem} refresh={getBusinesses} />
        }
    }
    function isActive(business: BusinessItem) {
        return business.id === selectedBusiness?.id
    }

    return (
        <main className=" p-24 w-100">
            <div className='w-11/12'>
                <h1 className="inline-block w-3/12">Welcome back</h1>
                <div className="w-100 p-5">
                    <div className="inline-block w-2/12"><AddBusinessForm refresh={getBusinessEntries} /></div>
                    {businesses.map((business) => {
                        return <div
                            className={`tab-option inline-block p-4 ${isActive(business) ? 'active-section' : ''}`}
                            onClick={(e) => { setSelectedBusiness(business) }}
                        >
                            {business.name}
                        </div>
                    })}
                </div>
                <div className="dashboard-container">
                    <div className="w-100 p-5">
                        <div className='content border-white w-100 h-100 p-4'>
                            <div className="p-2 w-100 ">
                                <div className="p-2">
                                    <div className='w-100 grid-flow-row font-bold'>
                                        <div className='w-11/12 p-2 inline-block' >
                                            <h1 style={{ fontSize: '32px', color: 'white' }}>🎯 {selectedBusiness?.name}</h1>
                                        </div>

                                    </div>
                                    {/* <div className='w-100 w-10/12 '>
                                        <div
                                            className={`tab-option inline-block p-4 ${isTabActive(Tab.BUSINESS_DASHBOARD, active)}`}
                                            onClick={(e) => setActive(Tab.BUSINESS_DASHBOARD)}
                                        >
                                            Dashboard
                                        </div>
                                        <div
                                            className={`tab-option inline-block p-4 ${isTabActive(Tab.BUSINESS_ENTRIES, active)}`}
                                            onClick={(e) => setActive(Tab.BUSINESS_ENTRIES)}
                                        >
                                            Entries
                                        </div>
                                    </div> */}
                                    <div className='w-5/12 inline-block '>
                                        <div className="inline-block mt-5 w-11/12 total-card">
                                            <h1>Total Expected</h1>
                                            <div>R{entriesTotal}</div>
                                        </div>
                                        <div className="inline-block mt-5 w-11/12 total-card">
                                            <h1>Total Received</h1>
                                            <div>R{paymentsTotal}</div>
                                        </div>
                                        <div className="inline-block mt-5 w-11/12 total-card">
                                            <h1>Total Remainder</h1>
                                            <div>R{entriesTotal - paymentsTotal}</div>
                                        </div>
                                        <div className="inline-block mt-5 w-11/12 total-card">
                                            <h1>Current Remainder</h1>
                                            <div>R{entriesTotal - paymentsTotal}</div>
                                        </div>
                                    </div>
                                    <div className='p-4 w-7/12 inline-block h-11/12'>
                                        {selectedBusiness && renderContent()}
                                    </div>
                                    <div className=' w-100 bg-white text-black p-5 text-left' style={{ borderRadius: '10px', fontWeight: 700, marginTop: '69px' }}>
                                        <div className='inline-block w-6/12' >Dashboard Overview</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
}

export default Page;