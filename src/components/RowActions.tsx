import Image from "next/image";

import editSvg from '../assets/edit-icon.svg'
import deleteSvg from '../assets/garbage-icon.svg'


interface RowActionsProps {
    deleteItem: (id:number) => void,
    setOpenForm: (open:boolean) => void,
    index: number
}   
 
function RowActions(props: RowActionsProps){
    return (  <div className="justify-center mt-2">
    <button className="mr-3 inline-block" onClick={(e) => props.deleteItem(props.index)}>
        <Image alt="delete" src={deleteSvg} height={25} width={25} className="btn-delete"/>
    </button>
    <button className="inline-block" onClick={(e) => props.setOpenForm(true)}>
        <Image alt="edit" src={editSvg} height={25} width={25} className=" btn-edit"/>
    </button>
</div>);
}
 
export default RowActions;