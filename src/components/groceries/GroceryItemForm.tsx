import { GroceryItem } from "@/model/models";
import { useEffect, useState } from "react";
import FormModal from "../shared/FormModal";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";
import { GroceryService } from "@/service/GroceryService";

interface GroceryItemFormProps {
    item?: GroceryItem;
    refresh:()=> void;
    setOpen:(b:boolean)=>void;
    open: boolean;
}
 
function GroceryItemForm(props: GroceryItemFormProps){

    const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const gs = new GroceryService();

    useEffect(()=>{
        if(props.item){
            setSelectedItem(props.item);
        }
    },[props.item]);

    function updateItem(e:any,target: string){
        const value = e.target.value
        console.log('Updating,', value);
        
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as GroceryItem)
    }

    function handleAddGroceryItem(e:any){
        
        if(selectedItem && selectedItem.id){
            handleEditGroceryItem( {...selectedItem as GroceryItem})
        }else{
            const item = {...selectedItem}
            if(item){
               saveGroceryItem( {...item as GroceryItem})
            }
        }
    }

    function saveGroceryItem(selectedItem: GroceryItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = month.toString();
            item.year = year;
            item.dateCreated = Date.now().toString();
            gs.addNew( {...item})
        }
        props.setOpen(false)
        props.refresh();
    }

    function handleEditGroceryItem(selectedItem: GroceryItem){
        if(selectedItem){
            gs.update( {...selectedItem})
        }
        props.setOpen(false)
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
                                <input type="text" className="text-black"
                                    value={selectedItem?.description}
                                    onChange={(e)=> updateItem(e,'description')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Quantity</div>
                                <input type="number" className="text-black"
                                    value={selectedItem?.quantity}
                                    onChange={(e)=> updateItem(e,'quantity')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Expected Amount</div>
                                <input type="number" className="text-black"
                                    value={selectedItem?.expectedAmount}
                                    onChange={(e)=> updateItem(e,'expectedAmount')}/>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="inline-block mr-2">
                                <div> Actual Amount</div>
                                <input type="number" className="text-black" value={selectedItem?.actualAmount}  onChange={(e)=> updateItem(e,'actualAmount')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Discounted Amount</div>
                                <input type="number" className="text-black" value={selectedItem?.discountAmount}  onChange={(e)=> updateItem(e,'discountAmount')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Month</div>
                                <input type="number" className="text-black" value={selectedItem?.month}  onChange={(e)=> updateItem(e,'month')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Store</div>
                                <input type="text" className="text-black" value={selectedItem?.store}  onChange={(e)=> updateItem(e,'store')}/>
                            </div>
                            <button 
                                className="inline-block bg-blue-500 p-2 w-100 btn-add-item mt-2"
                                style={{borderRadius: '8px'}}
                                onClick={handleAddGroceryItem}>
                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Item
                            </button>
                        </div>
                    </div> 
                }
            />
            
        </>);
}
 
export default GroceryItemForm;