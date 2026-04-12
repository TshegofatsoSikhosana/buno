import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../../shared/FormModal";
import { BusinessService } from "@/service/BusinessService";
import { BusinessExpenseItem, BusinessItem } from "@/model/models";

interface BusinessExpenseItemEditFormProps {
    open: boolean;
    setOpen: (b: boolean) => void;
    item?: BusinessExpenseItem | null;
    refresh: () => void;
    businessItem: BusinessItem;
}

function BusinessExpenseItemEditForm(props: BusinessExpenseItemEditFormProps) {

    const [selectedItem, setSelectedItem] = useState<BusinessExpenseItem | null>(null);
    const [hasErrors, setHasErrors] = useState<boolean>(true);
    const year = useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const businessService = new BusinessService();

    useEffect(() => {
        if (props.item) {
            setSelectedItem(props.item);
        }
    }, [props.item]);

    useEffect(() => {
        validInputs()
    }, [selectedItem])

    function updateItem(e: any, target: string) {
        const value = e.target.value
        const item = { ...selectedItem }
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as BusinessExpenseItem)
    }

    function handleAddExpenseItem(e: any) {
        if (selectedItem && selectedItem.id) {
            handleEditExpenseItem({ ...selectedItem as BusinessExpenseItem })
        } else {
            const item = { ...selectedItem }
            if (item) {
                saveExpenseItem({ ...item as BusinessExpenseItem })
            }
        }
    }

    function saveExpenseItem(selectedItem: BusinessExpenseItem) {
        if (selectedItem) {
            let item = { ...selectedItem };
            const business = props.businessItem;
            console.log("Expected IS", business);

            item.businessId = business?.id || 0;
            item.month = month;
            item.year = year;
            item.dateCreated = Date.now().toString();
            businessService.addNewExpenseEntry({ ...item })
        }
        props.setOpen(false);
        props.refresh();
    }

    function handleEditExpenseItem(selectedItem: BusinessExpenseItem) {
        if (selectedItem) {
            businessService.updateExpenseEntry({ ...selectedItem })
        }
        props.setOpen(false);
        props.refresh();
    }

    function handleDeleteBusinessItem() {
        if (selectedItem && selectedItem.id) {
            businessService.delete(Number(selectedItem.id))
        }
        props.setOpen(false);
        props.refresh();
    }

    function validInputs() {
        if (selectedItem) {
            if (selectedItem.description && selectedItem.amount >= 0) {
                setHasErrors(false)
                return;
            }
        }
        setHasErrors(true);
    }

    return (<FormModal
        open={props.open}
        onClose={props.setOpen}
        form={
            <div className="p-2">
                <div className="p-2">
                    <div className="inline-block mr-2 ">
                        <div> Description</div>
                        <input type="text" className="text-black" value={selectedItem?.description} onChange={(e) => updateItem(e, 'description')} />
                    </div>
                    <div className="inline-block mr-2">
                        <div> Expected Amount</div>
                        <input type="number" className="text-black" value={selectedItem?.expectedAmount} onChange={(e) => updateItem(e, 'expectedAmount')} />
                    </div>
                    <div className="inline-block mr-2">
                        <div> Actual Amount</div>
                        <input type="number" className="text-black" value={selectedItem?.amount} onChange={(e) => updateItem(e, 'amount')} />
                    </div>
                </div>
                <div className="p-2">
                    <button
                        className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                        style={{ borderRadius: '8px' }}
                        disabled={hasErrors}
                        onClick={handleAddExpenseItem}>
                        {selectedItem && selectedItem.id ? 'Edit' : 'Add'} Expense
                    </button>
                    {selectedItem && selectedItem.id && <button
                        className="inline-block bg-blue-500 p-2 w-100 btn-remove-item ml-2"
                        style={{ borderRadius: '8px' }}
                        disabled={hasErrors}
                        onClick={handleDeleteBusinessItem}>
                        Delete
                    </button>}
                </div>
            </div>
        } />);
}

export default BusinessExpenseItemEditForm;