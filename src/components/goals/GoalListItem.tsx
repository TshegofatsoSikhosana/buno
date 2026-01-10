import { GoalItem } from "@/model/models";
import Image from "next/image";
import editSvg from "../../assets/edit-green-icon.svg";
import detailsSvg from "../../assets/details-icon.svg";
import { useState } from "react";
import GoalItemDetails from "./GoalItemDetails";

interface GoalListItemProps {
  goal: GoalItem;
  index: number;
  totalContributions: number;
}

function GoalListItem({ goal, index, totalContributions }: GoalListItemProps) {

    const [openForm, setOpenForm] = useState(false);
    



    function close(v: boolean) {
        setOpenForm(v);
    }

    return (
    <>
        <div
        className="inline-block mr-5 w-3/12 mt-2"
        style={{
            border: "2px solid rgba(222,222,222,0.5)",
            background: "rgba(255, 255, 255, 0.75)",
            color: "rgb(22, 26, 43)",
            padding: "1rem",
            borderRadius: "10px",
        }}
        key={index}
        >
        <div className="w-7/12 inline-block">
            <div className="font-bold">{goal.name}</div>
            <div>Target: R{goal.targetAmount}</div>
            <div>Contributions: R{totalContributions}</div>
        </div>
        <div className="w-3/12 inline-block text-end p-2" style={{color:'green'}}>
            <button onClick={(e) => setOpenForm(true)} className="mr-2">
                <Image
                    alt="details"
                    src={detailsSvg}
                    height={32}
                    width={32}
                    className=" btn-edit"
                    />
            </button>
            <button onClick={(e) => setOpenForm(true)}>
                <Image
                    alt="edit"
                    src={editSvg}
                    height={30}
                    width={30}
                    className=" btn-edit"
                    />
            </button>
        </div>
        </div>
        {openForm && (
            <GoalItemDetails
                open={openForm}
                setOpen={close}
                refresh={() => {}}
                item={goal}
            />
            )}
    </>
    );
}

export default GoalListItem;
