import {  BusinessItem, BusinessPaymentItem, BusinessExpectedItem} from "@/model/models";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../../shared/FormModal";
import { GoalsService } from "@/service/GoalsService";
import RowActions from "../../shared/RowActions";
import { getActualTotal, getAmountTotal, getExpectedTotal, getMonth, months } from "@/util/utils";
import ProgressBar from "@/components/shared/ProgressBar";
import { BusinessService } from "@/service/BusinessService";
import PaymentItemEditForm from "./PaymentItemEditForm";
import { get } from "http";

interface BusinessItemDetailsProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    item?: BusinessItem;
    refresh: ()=> void;
}
 
function BusinessItemDetails(props: BusinessItemDetailsProps){

    const year = useSelector(budgetSelectors.getCurrentYear);
    const businessService = new BusinessService();

    const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<BusinessExpectedItem | null>(null);
    const [selectedPaymentItem, setSelectedPaymentItem] = useState<BusinessPaymentItem | null>(null);
    const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(-1);
    const [selectedPaymentEntryIndex, setSelectedPaymentEntryIndex] = useState<number>(-1);

    const [expectedEntries, setExpectedEntries] = useState<BusinessExpectedItem[]>([]);
    const [entriesTotal, setEntriesTotal] = useState<number>(0);
    const [paymentsTotal, setPaymentsTotal] = useState<number>(0);

    const [openForm,setOpenForm] = useState(false);
    const [openPaymentForm,setOpenPaymentForm] = useState(false);
    const [hasErrors, setHasErrors] = useState<boolean>(true);

    useEffect(()=>{
        if(props.item){
            setSelectedBusiness(props.item);
        }
    },[props.item]);

    useEffect(()=>{
        getBusinessEntries();
    },[selectedBusiness]);

    useEffect(()=>{
        validInputs();
    }, [selectedItem]);

    useEffect(()=>{
        const item =  expectedEntries[selectedEntryIndex - 1];
        if(item){
            setSelectedItem({...item});
            console.log("Selected: ",item);
            
        }else{
            setSelectedItem(null);
        }
    },[selectedEntryIndex]);

    function getBusinessEntries(){
        if(props.item && props.item.id){
            // const target = props.item.targetAmount ? Number(props.item.targetAmount) : 0;
            businessService.getBusinessEntries(props.item.id as number).then((entries)=>{
                    setExpectedEntries(entries as BusinessExpectedItem[]);
                    
                    const total = businessService.getEntriesTotal(entries);
                    setEntriesTotal(total);
                    const paymentsTotal = businessService.getPaymentEntriesTotal(entries);
                    setPaymentsTotal(paymentsTotal);
                    // const percentage = props.item && props.item.targetAmount ? Number((total / Number(props.item.targetAmount)) * 100).toFixed(2) : 0;
                    // setPercentageComplete(Number(percentage));
                });
        }
    }

    function updateItem(e:any,target: string){
        const value = e.target.value
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as BusinessExpectedItem)
    }

    function openPayementForm(index: number, payment?: BusinessPaymentItem){
        const item =  expectedEntries[index];
        if(item){
            setSelectedEntryIndex(index+1);
            if(payment){
                setSelectedPaymentItem({...payment});
            } else{
                setSelectedPaymentItem(null);
            }
            setOpenPaymentForm(true);
        }
    }

    function handleAddBusinessExpectedItem(e:any){
        if(selectedItem && selectedItem.id){
           handleEditBusinessExpectedItem( {...selectedItem as BusinessExpectedItem})
        }else{
            const item = {...selectedItem}            
            if(item){
                handleSaveBusinessExpectedItem({...item as BusinessExpectedItem})
            }
        }
        getBusinessEntries();
        setOpenForm(false);
        props.refresh();
    }

    function handleSaveBusinessExpectedItem(selectedItem: BusinessExpectedItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.businessId = selectedBusiness?.id as number;
            item.dateCreated = Date.now().toString();
            businessService.addNewExpectedEntry({...item});
            setSelectedItem(null);
        }
    }

    function handleEditBusinessExpectedItem(selectedItem: BusinessExpectedItem){
        if(selectedItem){
            // businessService.updateEntry( {...selectedItem})
        }
    }

    function deleteItem(index: number){
        if(expectedEntries && Number(selectedEntryIndex) >= 0 ){
            businessService.deleteEntry(Number(expectedEntries[index].id))
            getBusinessEntries(); 
        }
    }

    function validInputs(){
        if(selectedItem){
            if(Number(selectedItem.amount) >= 0 &&
                 Number(selectedItem.month) >= 0){
                    setHasErrors(false)
                    return;
            }
        }
        setHasErrors(true);
    }

    function getPaymentPercentage(payments: BusinessPaymentItem[]){
        return Number((getAmountTotal(payments as BusinessPaymentItem[]) / getExpectedTotal(payments as BusinessPaymentItem[]) * 100).toFixed(2)) || 0
    }
    
    return (<>
            <FormModal
                open={props.open}
                onClose={props.setOpen}
                classes="dashboard-container"
                form={
                    <div className="p-2 w-100 ">
                        <div className="p-2">
                            <div className='w-100 grid-flow-row font-bold'> 
                                <div className='w-4/12 p-2 inline-block' >
                                    <h1 style={{fontSize:'32px', color:'white'}}>🎯 {selectedBusiness?.name}</h1>
                                </div>
                                <div className="inline-block mr-5 w-2/12 total-card">
                                        <h1>Expected</h1>
                                        <div>R{entriesTotal}</div>
                                </div>
                                 <div className="inline-block mr-5 w-2/12 total-card">
                                        <h1>Contributed</h1>
                                        <div>R{paymentsTotal}</div>
                                </div>
                                <div className="inline-block mr-5 w-2/12 total-card">
                                        <h1>Remainder</h1>
                                        <div>R{entriesTotal - paymentsTotal}</div>
                                </div>
                                <div className="w-100 mt-5 mb-2">
                                    {!openForm && <button
                                        className="p-2 mb-2 btn-add"
                                        onClick={(e) => setOpenForm(true)}
                                    >
                                        Add Entry
                                    </button>}
                                </div>
                               
                            </div>
                            {!openForm ?
                            <>
                            <div className='w-100 grid-flow-row' >
                                <div className="w-10/12 inline-block">
                            { !openPaymentForm ?
                                   <>
                                   {expectedEntries.map((entry, entryIndex)=>{
                                        return <details key={entryIndex}>
                                            <summary style={{
                                                                borderRadius: "10px",
                                                                backgroundColor: "white",
                                                                color: 'rgb(30,150,222,255)',
                                                                 cursor: 'pointer'}} 
                                                                 className="mt-2 p-4">
                                                    {getMonth(entry.month)} {entry.year}
                                            </summary>
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
                                                        <ProgressBar percentageComplete={ getPaymentPercentage(entry.payments as BusinessPaymentItem[])}/>
                                                    </div>
                                                
                                                    <div className='w-3/12 p-2 inline-block font-bold text-center' style={{border: '2px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                                        Expected 
                                                    </div>
                                                    <div className='w-3/12 p-2 inline-block font-bold text-center' style={{border: '2px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                                        Actual 
                                                    </div>
                                                </div>
                                                <div className='w-11/12 grid-flow-row inline-block mb-2'>
                                                    <div className='w-2/12 p-2 inline-block text-center' > </div>
                                                    <div className='w-4/12 p-2 inline-block text-start font-bold' >
                                                    
                                                    </div>
                                                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '2px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                                        R{getExpectedTotal(entry.payments as BusinessPaymentItem[])}
                                                    </div>
                                                    <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '2px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                                        R{getAmountTotal(entry.payments as BusinessPaymentItem[])}
                                                    </div>
                                                </div>
                                                {entry.payments?.map((payment, index)=>{
                                                    return <div className='w-11/12 grid-flow-row row-text-block'
                                                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                                                key={index}
                                                                onClick={(e)=> setSelectedPaymentEntryIndex(index+1)}
                                                                onMouseLeave={(e)=> setSelectedPaymentEntryIndex(-1)}>
                                                                <div className='w-2/12 inline-block text-center' > 
                                                                {Number(selectedPaymentEntryIndex) - 1 === index ? 
                                                                    (<RowActions deleteItem={deleteItem} setOpenForm={() => openPayementForm(entryIndex, payment)} index={index}/>)
                                                                    : <></>
                                                                }
                                                                </div>
                                                                {/* <div className='w-2/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{entry.id}</div> */}
                                                                <div className='w-4/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> {payment.description}</div>
                                                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{payment.expectedAmount}</div>
                                                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{payment.amount}</div>
                                                        </div>
                                                })}
                                            </div>
                                        </details>
                                    })}
                                    </> :
                                    <>
                                        <PaymentItemEditForm item={selectedPaymentItem} open={openPaymentForm} setOpen={setOpenPaymentForm} refresh={getBusinessEntries} businessExepectedItem={selectedItem}/>
                                    </>
                                }
                                </div>
                                
                            </div>
                            </>
                            :
                                <div className="p-2">
                                    <div className="p-2">
                                        <div className="inline-block mr-2 w-11/12">
                                            <div className="font-bold py-2">New entry:</div>
                                        </div>
                                          <div className="inline-block mr-2">
                                            <div> Month</div>
                                                <select className="text-black p-2"
                                                    style={{borderRadius: '5px', backgroundColor: 'white'}}
                                                    value={selectedItem?.month}
                                                    onChange={(e)=> updateItem(e,'month')}>
                                                <option value={-1}>-Select-</option>
                                                {months.map((month, index)=>{
                                                    return <option key={index} value={index+1}>{month}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className="inline-block mr-2">
                                            <div> Amount</div>
                                            <input type="number" className="text-black" value={selectedItem?.amount}  onChange={(e)=> updateItem(e,'amount')}/>
                                        </div>
                                      
                                        <div className="inline-block mr-2">
                                            <div> Year</div>
                                            <input type="number" className="text-black" value={selectedItem?.year}  onChange={(e)=> updateItem(e,'year')}/>
                                        </div>
                                        </div>
                                        <div className="p-2">
                                            <button 
                                                className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                                                style={{borderRadius: '8px'}}
                                                disabled={hasErrors}
                                                onClick={handleAddBusinessExpectedItem}>
                                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Entry
                                                </button>
                                    </div>
                                </div>
                            }
                        </div>

                    </div> 
             }
             />
        </>);
}
 
export default BusinessItemDetails;