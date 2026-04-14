'use client';
import AddBusinessForm from "@/components/business/AddBusinessForm";
import BusinessDashboard from "@/components/business/dashboard/BusinessDashboard";
import EntriesTab from "@/components/business/entries/EntriesTab";
import { BusinessItem } from "@/model/models";
import { isTabActive, Tab } from "@/model/shared";
import { BusinessService } from "@/service/BusinessService";
import { budgetActions, budgetSelectors } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { filterByMonthAndYear, getMonth } from "@/util/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


function Page() {

    const year = useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const businessService = new BusinessService();

    const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(null);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
    const [active, setActive] = useState<Tab>(Tab.BUSINESS_ENTRIES);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if(selectedId < 0){
            getBusinesses();
        }else{
            setSelectedBusiness(businesses[selectedId]);
        }
    }, [businesses, selectedId]);


    function getBusinesses() {
        if (!selectedBusiness) {
            businessService.getBusinesses().then((business) => {
                setBusinesses(business);
                setSelectedId(0);
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
                return <EntriesTab selectedBusiness={selectedBusiness as BusinessItem} refresh={getBusinesses} />
            default:
                return <BusinessDashboard selectedBusiness={selectedBusiness as BusinessItem} />
        }
    }
    function isActive(business: BusinessItem) {
        return business.id === selectedBusiness?.id
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

    return (
        <main className=" p-24 w-100">
            <div className='w-11/12'>
                <h1 className="w-100 mb-3">Welcome back</h1>
                <div className="p-2 inline-block w-8/12" style={{backgroundColor: 'rgba(26, 32, 61, 1)', borderTopLeftRadius: '10px',  borderTopRightRadius: '10px'}}>
                    {businesses.map((business, index) => {
                        return <div key={index}
                            className={`tab-option inline-block p-4 ${isActive(business) ? 'active-section' : ''}`}
                            onClick={(e) => { setSelectedId(index); }}
                        >
                            {business.name}
                        </div>
                    })}
                </div>
                <div className="inline-block w-4/12">
                    <div className="w-100"><AddBusinessForm refresh={getBusinesses} /></div>
                </div>
                <div className="dashboard-container" style={{width:'100%'}}>
                    <div className="w-100 p-5">
                        <div className='content border-white w-100 h-100 p-4'>
                            <div className="p-2 w-100 ">
                                <div className="p-2">
                                    <div className='w-100 grid-flow-row font-bold'>
                                        <div className='w-11/12 p-2 inline-block mb-3' >
                                            <h1 style={{ fontSize: '32px', color: 'white' }}>🎯 {selectedBusiness?.name}</h1>
                                        </div>
                                    </div>
                                        {selectedBusiness && renderContent()}
                                    <div className=' w-100 bg-white text-black p-5 text-left' style={{ borderRadius: '10px', fontWeight: 700, marginTop: '69px' }}>
                                        <div className='inline-block w-6/12' >Dashboard Overview</div>
                                    </div>
                                    <BusinessDashboard selectedBusiness={selectedBusiness as BusinessItem} />
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