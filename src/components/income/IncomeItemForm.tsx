import {  IncomeItem } from "@/model/models";
import { useEffect, useState } from "react";

interface IncomeItemFormProps {
    handleAddIncomeItem: (selectedItem:IncomeItem)=> void
    handleEditIncomeItem: (selectedItem:IncomeItem)=> void;
    item?: IncomeItem
}
 
function IncomeItemForm(props: IncomeItemFormProps){

    const [selectedItem, setSelectedItem] = useState<IncomeItem | null>(null)


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
            props.handleEditIncomeItem( {...selectedItem as IncomeItem})
        }else{
            const item = {...selectedItem}
            item.dateCreated = Date.now().toString();
            item.year = 2024;
            if(item){
                props.handleAddIncomeItem( {...item as IncomeItem})
            }
        }
    }

    return (<>
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
        </>);
}
 
export default IncomeItemForm;