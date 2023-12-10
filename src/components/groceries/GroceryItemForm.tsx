import { GroceryItem } from "@/model/models";
import { useState } from "react";

interface GroceryItemFormProps {
    handleAddGroceryItem: (selectedItem:GroceryItem)=> void
}
 
function GroceryItemForm(props: GroceryItemFormProps){

    const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null)


    function updateItem(e:any,target: string){
        const value = e.target.value
        console.log('Updating,', value);
        
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as GroceryItem)
    }

    function handleAddGroceryItem(e:any){
        console.log('debiiie')
        const item = {...selectedItem}
        item.dateCreated = Date.now().toString();

        if(item){
            props.handleAddGroceryItem( {...item as GroceryItem})
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
                        <div> Quantity</div>
                        <input type="number" className="text-black" value={selectedItem?.quantity}  onChange={(e)=> updateItem(e,'quantity')}/>
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
                        className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                        style={{borderRadius: '8px'}}
                        onClick={handleAddGroceryItem}>Add Item</button>
                </div>
            </div> 
        </>);
}
 
export default GroceryItemForm;