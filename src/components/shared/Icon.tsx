import Image from "next/image";


interface IconProps{
    svgPath: string;
    onClick: ()=>void;
}


function Icon(props:IconProps) {
return (<>
            <Image alt="edit" src={props.svgPath} height={25} width={25} className=" btn-edit ml-2" onClick={(e)=> props.onClick()}/>
        </> );
}

export default Icon;