import {  GoalItem} from "@/model/models";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../shared/FormModal";
import { GoalsService } from "@/service/GoalsService";

interface GoalItemDetailsProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    item?: GoalItem;
    refresh: ()=> void;
}
 
function GoalItemDetails(props: GoalItemDetailsProps){

    const [selectedItem, setSelectedItem] = useState<GoalItem | null>(null);
    const [hasErrors, setHasErrors] = useState<boolean>(true);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const is = new GoalsService();

    useEffect(()=>{
        if(props.item){
            setSelectedItem(props.item);
        }
    },[props.item]);

    useEffect(()=>{
        validInputs()
    }, [selectedItem])

    function updateItem(e:any,target: string){
        const value = e.target.value
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as GoalItem)
    }

    function handleAddGoalItem(e:any){
        if(selectedItem && selectedItem.id){
           handleEditGoalItem( {...selectedItem as GoalItem})
        }else{
            const item = {...selectedItem}
            if(item){
                saveGoalItem({...item as GoalItem})
            }
        }
    }

    function saveGoalItem(selectedItem: GoalItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.targetYear = year;
            item.dateCreated = Date.now().toString();
            is.addNew( {...item})
        }
        props.setOpen(false);
        props.refresh();
    }

    function handleEditGoalItem(selectedItem: GoalItem){
        if(selectedItem){
            is.update( {...selectedItem})
        }
        props.setOpen(false);
        props.refresh();
    }

    function validInputs(){
        if(selectedItem){
            if(Number(selectedItem.targetAmount) >= 0 &&
                 Number(selectedItem.targetYear) >= 0 &&
                 selectedItem.name){
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
                                <div> Goal Name</div>
                                <input type="text" className="text-black" value={selectedItem?.name} onChange={(e)=> updateItem(e,'name')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Target Amount</div>
                                <input type="number" className="text-black" value={selectedItem?.targetAmount}  onChange={(e)=> updateItem(e,'targetAmount')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Target Year</div>
                                <input type="number" className="text-black" value={selectedItem?.targetYear}  onChange={(e)=> updateItem(e,'targetYear')}/>
                            </div>
                            </div>
                            <div className="p-2">
                                <button 
                                    className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                                    style={{borderRadius: '8px'}}
                                    disabled={hasErrors}
                                    onClick={handleAddGoalItem}>
                                        {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Goal
                                    </button>
                        </div>
                    </div> 
             }
             />
        </>);
}
 
export default GoalItemDetails;