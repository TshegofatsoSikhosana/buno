import {  InvestmentItem } from "@/model/models";
import { InvestmentService } from "@/service/InvestmentService";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../shared/FormModal";

interface InvestmentItemFormProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    refresh: ()=> void;
    item?: InvestmentItem;
}
 
function InvestmentItemForm(props: InvestmentItemFormProps){

    const [selectedItem, setSelectedItem] = useState<InvestmentItem | null>(null);
    const [hasErrors, setHasErrors] = useState<boolean>(true);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const is = new InvestmentService();

    useEffect(()=>{
        if(props.item){
            setSelectedItem(props.item);
        }
    },[props.item])

    useEffect(()=>{
        validInputs()
    }, [selectedItem])

    function updateItem(e:any,target: string){
        const value = e.target.value
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as InvestmentItem)
    }

    function handleAddInvestmentItem(e:any){
        if(selectedItem && selectedItem.id){
            handleEditInvestmentItem( {...selectedItem as InvestmentItem})
        }else{
            const item = {...selectedItem}
            if(item){
                saveInvestmentItem( {...item as InvestmentItem})
            }
        }
    }
    function saveInvestmentItem(selectedItem: InvestmentItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = month.toString();
            item.year = year;
            item.dateCreated = Date.now().toString();
            is.addNew({...item})
        }
        props.setOpen(false)
        props.refresh();
    }

    function handleEditInvestmentItem(selectedItem: InvestmentItem){
        if(selectedItem){
            is.update( {...selectedItem})
        }
        props.setOpen(false)
        props.refresh();
    }

    function validInputs(){
        if(selectedItem){
            if(Number(selectedItem.actualAmount) >= 0 &&
                 Number(selectedItem.expectedAmount) >= 0 &&
                 selectedItem.description){
                    setHasErrors(false)
                    return;
            }
        }
        setHasErrors(true);
    }

    return (<>
            <FormModal
                open={props.open}
                onClose={props.setOpen}
                form={
                    <div className="p-2">
                        <div className="p-2">
                            <div className="inline-block mr-2 ">
                                <div> Description</div>
                                <input type="text" className="text-black" value={selectedItem?.description} onChange={(e)=> updateItem(e,'description')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Expected Amount</div>
                                <input type="number" className="text-black" value={selectedItem?.expectedAmount}  onChange={(e)=> updateItem(e,'expectedAmount')}/>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="inline-block mr-2">
                                <div> Actual Amount</div>
                                <input type="number" className="text-black" value={selectedItem?.actualAmount}  onChange={(e)=> updateItem(e,'actualAmount')}/>
                            </div>
                            <div className="inline-block mr-2 ">
                                <div> Bank</div>
                                <input type="text" className="text-black" value={selectedItem?.bank} onChange={(e)=> updateItem(e,'bank')}/>
                            </div>
                            <button 
                                className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                                style={{borderRadius: '8px'}}
                                disabled={hasErrors}
                                onClick={handleAddInvestmentItem}>
                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Item
                                </button>
                        </div>
                    </div> 
                }
            />
        </>);
}
 
export default InvestmentItemForm;