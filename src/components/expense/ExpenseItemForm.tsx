import { ExpenseCategory, ExpenseItem } from "@/model/models";
import { useState } from "react";

interface ExpenseItemFormProps {
    handleAddExpenseItem: (selectedItem:ExpenseItem)=> void
}
 
function ExpenseItemForm(props: ExpenseItemFormProps){

    const [selectedItem, setSelectedItem] = useState<ExpenseItem | null>(null)


    function updateItem(e:any,target: string){
        const value = e.target.value
        console.log('Updating,', value);
        
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as ExpenseItem)
    }

    function handleAddExpenseItem(e:any){
        console.log('debiiie')
        const item = {...selectedItem}
        item.dateCreated = Date.now().toString();
        item.year= 2023
        item.category = Number(selectedItem?.category)
        if(item){
            props.handleAddExpenseItem( {...item as ExpenseItem})
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
                    <div className="inline-block mr-2">
                        <div> Category</div>
                        <select className="text-black p-2"
                                style={{borderRadius: '5px', backgroundColor: 'white'}}
                                value={selectedItem?.category}
                                onChange={(e)=> updateItem(e,'category')}>
                            <option value={-1}>-Select-</option>
                            <option value={0}>Living</option>
                            <option value={1}>Personal</option>
                            <option value={2}>Exception</option>
                        </select>
                    </div>
                    <button 
                        className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                        style={{borderRadius: '8px'}}
                        onClick={handleAddExpenseItem}>Add Item</button>
                </div>
            </div> 
        </>);
}
 
export default ExpenseItemForm;