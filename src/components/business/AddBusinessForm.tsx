'use client'
import { BusinessService } from "@/service/BusinessService";
import FormModal from "../shared/FormModal";
import { useState } from "react";
import { BusinessItem } from "@/model/models";
import Image from "next/image";
import closeSvg from '../../assets/close.svg'



export default function AddBusinessForm({ refresh }: { refresh: () => void }) {

    const businessService = new BusinessService();
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BusinessItem>({ name: '', dateCreated: '' });
    const [hasErrors, setHasErrors] = useState<boolean>(true);


    function updateItem(e: any, target: string) {
        const value = e.target.value
        const item = { ...selectedItem }
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as BusinessItem)
    }

    function saveBusiness() {
        if (selectedItem) {
            let item = { ...selectedItem };
            console.log("Expected IS", item);

            item.dateCreated = Date.now().toString();
            businessService.addNew({ ...item })
        }
        setOpen(false);
        refresh();
    }


    return <>
        <button className="p-2 mb-2 btn-add ml-6 inline-block" onClick={() => setOpen(true)}>
            Add a business</button>
        {/* <Image alt="edit" src={closeSvg} height={50} width={50} className="inline-block ml-2 btn-add"/> */}

        <FormModal
            open={open}
            onClose={setOpen}
            form={
                <div className="p-2">
                    <div className="inline-block mr-2 ">
                        <div> Name:</div>
                        <input type="text" className="text-black" value={selectedItem?.name} onChange={(e) => updateItem(e, 'name')} />
                    </div>
                    <div className="p-2">
                        <button
                            className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                            style={{ borderRadius: '8px' }}
                            disabled={!hasErrors}
                            onClick={() => saveBusiness()}>
                            {selectedItem && selectedItem.id ? 'Edit' : 'Add'} Business
                        </button>
                    </div>
                </div>
            }
        />
    </>
}