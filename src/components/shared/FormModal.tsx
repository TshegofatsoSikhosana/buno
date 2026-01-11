import Image from "next/image";
import closeSvg from '../../assets/close.svg'

interface FormModalProps{
    form: any,
    onClose: (e:any) => void,
    open: boolean;
    classes?: string;
}

function FormModal(props: FormModalProps) {


    return (
        <>
            <dialog 
                open={props.open}
                onClose={() => props.onClose(false)}
                style={{ padding:'10px'}}>
                    <div className="w-9/12 modal-wrapper">
                        <Image alt="close" src={closeSvg}
                            height={50}
                            width={50}
                            className="btn-edit ml-2"
                            onClick={(e) => props.onClose(false)}/>
                        <div className={`modal ${props.classes}`}>
                            {props.form}
                        </div>
                    </div>
            </dialog>
        </> 
    );
}

export default FormModal;