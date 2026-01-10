import { GoalItem } from "@/model/models";
import Image from "next/image";
import editSvg from "../../assets/edit-green-icon.svg";
import detailsSvg from "../../assets/details-icon.svg";
import addSvg from "../../assets/add-icon.svg";
import { useState } from "react";
import GoalItemDetails from "./GoalItemDetails";
import GoalItemForm from "./GoalItemEditForm";

interface GoalListItemProps {
  goal: GoalItem;
  index: number;
  totalContributions: number;
  refresh: () => void;
}

function GoalListItem({ goal, index, totalContributions, refresh }: GoalListItemProps) {

    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    
    function close(v: boolean) {
        setOpenEditForm(v);
        setOpenDetails(v);
    }

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
            <div className="font-bold">{goal.name}</div>
            <div>Target: R{goal.targetAmount}</div>
            <div>Contributions: R{totalContributions}</div>
        </div>
        <div className="w-4/12 inline-block text-end p-2" style={{color:'green'}}>
            <button onClick={(e) => setOpenDetails(true)} className="mr-2">
                <Image
                    alt="add"
                    src={addSvg}
                    height={25}
                    width={25}
                    className="btn-edit"
                    />
            </button>
             <button onClick={(e) => setOpenDetails(true)} className="mr-2">
                <Image
                    alt="details"
                    src={detailsSvg}
                    height={27}
                    width={27}
                    className="btn-edit"
                    />
            </button>
            <button onClick={(e) => setOpenEditForm(true)}>
                <Image
                    alt="edit"
                    src={editSvg}
                    height={25}
                    width={25}
                    className="btn-edit"
                    />
            </button>
        </div>
        </div>
        {openEditForm && (
            <GoalItemForm
                open={openEditForm}
                setOpen={close}
                refresh={refresh}
                item={goal}
            />
            )}
        {openDetails && (
            <GoalItemDetails
                open={openDetails}
                setOpen={close}
                refresh={refresh}
                item={goal}
            />
            )}
    </>
    );
}

export default GoalListItem;
