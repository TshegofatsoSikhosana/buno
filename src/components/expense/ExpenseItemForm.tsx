import { ExpenseItem } from "@/model/models";
import { ExpenseService } from "@/service/ExpenseService";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../shared/FormModal";

interface ExpenseItemFormProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    refresh: ()=> void;
    item?: ExpenseItem
}
 
function ExpenseItemForm(props: ExpenseItemFormProps){

    const [selectedItem, setSelectedItem] = useState<ExpenseItem | null>(null)
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const es = new ExpenseService();

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
        if(target === "category") item[target] = Number(value)
        setSelectedItem(item as ExpenseItem)
    }

    function handleAddExpenseItem(e:any){
        if(selectedItem && selectedItem.id){
           handleEditExpenseItem( {...selectedItem as ExpenseItem})
        }else{
            const item = {...selectedItem}
            item.category = Number(selectedItem?.category)
            if(item){
                saveExpenseItem( {...item as ExpenseItem})
            }
        }
    }

    function saveExpenseItem(selectedItem: ExpenseItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = month.toString();
            item.year = year;
            item.dateCreated = Date.now().toString();
            es.addNew( {...item})
        }
        props.setOpen(false)
        props.refresh();
    }

    function handleEditExpenseItem(selectedItem: ExpenseItem){
        if(selectedItem){
            es.update( {...selectedItem})
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
                                onClick={handleAddExpenseItem}>
                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Item
                            </button>
                        </div>
                    </div> 
                }
            />
        </>);
}
 
export default ExpenseItemForm;