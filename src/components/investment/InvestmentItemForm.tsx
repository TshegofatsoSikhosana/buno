import {  InvestmentItem } from "@/model/models";
import { useEffect, useState } from "react";

interface InvestmentItemFormProps {
    handleAddIvestmentItem: (selectedItem:InvestmentItem)=> void
    handleEditInvestmentItem: (selectedItem:InvestmentItem)=> void;
    item?: InvestmentItem
}
 
function InvestmentItemForm(props: InvestmentItemFormProps){

    const [selectedItem, setSelectedItem] = useState<InvestmentItem | null>(null)

    useEffect(()=>{
        if(props.item){
            setSelectedItem(props.item);
        }
    },[props.item])

    function updateItem(e:any,target: string){
        const value = e.target.value
        console.log('Updating,', value);
        
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as InvestmentItem)
    }

    function handleAddInvestmentItem(e:any){
        if(selectedItem && selectedItem.id){
            props.handleEditInvestmentItem( {...selectedItem as InvestmentItem})
        }else{
            console.log('debiiie')
            const item = {...selectedItem}
            item.dateCreated = Date.now().toString();
            item.year = 2024
            if(item){
                props.handleAddIvestmentItem( {...item as InvestmentItem})
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
                    <div className="inline-block mr-2 ">
                        <div> Bank</div>
                        <input type="text" className="text-black" value={selectedItem?.bank} onChange={(e)=> updateItem(e,'bank')}/>
                    </div>
                    <button 
                        className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                        style={{borderRadius: '8px'}}
                        onClick={handleAddInvestmentItem}>
                            {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Item
                        </button>
                </div>
            </div> 
        </>);
}
 
export default InvestmentItemForm;