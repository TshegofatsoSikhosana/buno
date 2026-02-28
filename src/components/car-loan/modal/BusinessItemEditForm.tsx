import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../../shared/FormModal";
import { GoalsService } from "@/service/GoalsService";
import { BusinessService } from "@/service/BusinessService";
import { BusinessItem } from "@/model/models";

interface BusinessItemFormProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    item?: BusinessItem;
    refresh: ()=> void;
}
 
function BusinessItemEditForm(props: BusinessItemFormProps){

    const [selectedItem, setSelectedItem] = useState<BusinessItem | null>(null);
    const [hasErrors, setHasErrors] = useState<boolean>(true);
    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const businessService = new BusinessService();

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
        setSelectedItem(item as BusinessItem)
    }

    function handleAddBusinessItem(e:any){
        if(selectedItem && selectedItem.id){
           handleEditBusinessItem( {...selectedItem as BusinessItem})
        }else{
            const item = {...selectedItem}
            if(item){
                saveBusinessItem({...item as BusinessItem})
            }
        }
    }

    function saveBusinessItem(selectedItem: BusinessItem){
        if(selectedItem){
            let item = {...selectedItem};
            // item.targetYear = year;
            item.dateCreated = Date.now().toString();
            businessService.addNew( {...item})
        }
        props.setOpen(false);
        props.refresh();
    }

    function handleEditBusinessItem(selectedItem: BusinessItem){
        if(selectedItem){
            businessService.update( {...selectedItem})
        }
        props.setOpen(false);
        props.refresh();
    }

    function handleDeleteBusinessItem(){
        if(selectedItem && selectedItem.id){
            businessService.delete(Number(selectedItem.id))
        }
        props.setOpen(false);
        props.refresh();
    }

    function validInputs(){
        if(selectedItem){
            if(selectedItem.name){
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
                                <div> Business Name</div>
                                <input type="text" className="text-black" value={selectedItem?.name} onChange={(e)=> updateItem(e,'name')}/>
                            </div>
                            {/* <div className="inline-block mr-2">
                                <div> Target Amount</div>
                                <input type="number" className="text-black" value={selectedItem?.targetAmount}  onChange={(e)=> updateItem(e,'targetAmount')}/>
                            </div>
                            <div className="inline-block mr-2">
                                <div> Target Year</div>
                                <input type="number" className="text-black" value={selectedItem?.targetYear}  onChange={(e)=> updateItem(e,'targetYear')}/>
                            </div> */}
                            </div>
                            <div className="p-2">
                                <button 
                                    className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                                    style={{borderRadius: '8px'}}
                                    disabled={hasErrors}
                                    onClick={handleAddBusinessItem}>
                                        {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Business
                                </button>
                                {selectedItem && selectedItem.id && <button 
                                    className="inline-block bg-blue-500 p-2 w-100 btn-remove-item ml-2"
                                    style={{borderRadius: '8px'}}
                                    disabled={hasErrors}
                                    onClick={handleDeleteBusinessItem}>
                                        Delete
                                </button>}
                        </div>
                    </div> 
             }
             />
        </>);
}
 
export default BusinessItemEditForm;