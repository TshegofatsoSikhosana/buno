import { BusinessItem, GoalItem } from "@/model/models";
import Image from "next/image";
import editSvg from "../../assets/edit-purple-icon.svg";
import detailsSvg from "../../assets/details-icon.svg";
import { useState } from "react";
import BusinessItemEditForm from "./modal/BusinessItemEditForm";
import BusinessItemDetails from "./modal/BusinessItemDetails";

interface BusinessListItemProps {
  business: BusinessItem;
  index: number;
  totalContributions: number;
  refresh: () => void;
}

function BusinessListItem({ business, index, totalContributions, refresh }: BusinessListItemProps) {

    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    
    function close(v: boolean) {
        setOpenEditForm(v);
        setOpenDetails(v);
    }

    // function getPercentageComplete(){ 
    //     return business.targetAmount > 0 ? Number((totalContributions / business.targetAmount) * 100).toFixed(2) : 0;
    // }
    

    return (
    <>
        <div
        className="inline-block mr-5 w-3/12 mb-3"
        style={{
            border: "2px solid rgba(222,222,222,0.5)",
            background: "rgba(255, 255, 255, 0.75)",
            color: "rgb(22, 26, 43)",
            padding: "1rem",
            borderRadius: "10px",
        }}
        key={index}
        >
            <div className="w-8/12 inline-block">
                <div className="font-bold">{business.name}</div>
                {/* <div>Target: R{business.targetAmount}</div> */}
                <div>Contributions: R{totalContributions}</div>
            </div>
            <div className="w-4/12 inline-block text-end p-2" style={{color:'green'}}>
                <button onClick={(e) => setOpenDetails(true)} className="mr-2">
                    <Image
                        alt="details"
                        src={detailsSvg}
                        height={30}
                        width={30}
                        className="btn-edit"
                        />
                </button>
                <button onClick={(e) => setOpenEditForm(true)}>
                    <Image
                        alt="edit"
                        src={editSvg}
                        height={30}
                        width={30}
                        className="btn-edit"
                        />
                </button>
            </div>
            {/* <div className='w-100 grid-flow-row font-bold'> 
                <ProgressBar percentageComplete={getPercentageComplete()} textColor="white" borderColor="rgb(30,125,180,255)" />
            </div> */}
        </div>
       
        {openEditForm && (
            <BusinessItemEditForm
                open={openEditForm}
                setOpen={close}
                refresh={refresh}
                item={business}
            />
            )}
        {openDetails && (
            <BusinessItemDetails
                open={openDetails}
                setOpen={close}
                refresh={refresh}
                item={business}
            />
            )}
    </>
    );
}

export default BusinessListItem;
