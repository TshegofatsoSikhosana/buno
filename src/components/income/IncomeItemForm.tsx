import {  IncomeItem } from "@/model/models";
import { IncomeService } from "@/service/IncomeService";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../shared/FormModal";

interface IncomeItemFormProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    item?: IncomeItem;
    refresh: ()=> void;
}
 
function IncomeItemForm(props: IncomeItemFormProps){

    const [selectedItem, setSelectedItem] = useState<IncomeItem | null>(null)
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const is = new IncomeService();

    useEffect(()=>{
        if(props.item){
            setSelectedItem(props.item);
        }
    },[props.item])

    function updateItem(e:any,target: string){
        const value = e.target.value
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as IncomeItem)
    }

    function handleAddIncomeItem(e:any){
        if(selectedItem && selectedItem.id){
           handleEditIncomeItem( {...selectedItem as IncomeItem})
        }else{
            const item = {...selectedItem}
            if(item){
                saveIncomeItem({...item as IncomeItem})
            }
        }
    }

    function saveIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = month.toString();
            item.year = year;
            item.dateCreated = Date.now().toString();
            is.addNew( {...item})
        }
        props.setOpen(false);
        props.refresh();
    }

    function handleEditIncomeItem(selectedItem: IncomeItem){
        if(selectedItem){
            is.update( {...selectedItem})
        }
        props.setOpen(false);
        props.refresh();
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
                            <div className="inline-block mr-2">
                                <div> Month</div>
                                <input type="number" className="text-black" value={selectedItem?.month}  onChange={(e)=> updateItem(e,'month')}/>
                            </div>
                            <button 
                                className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                                style={{borderRadius: '8px'}}
                                onClick={handleAddIncomeItem}>
                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Item
                                </button>
                        </div>
                    </div> 
             }
             />
        </>);
}
 
export default IncomeItemForm;