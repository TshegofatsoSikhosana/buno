import { budgetSelectors } from "@/store";
import { months } from "@/util/utils";
import { useSelector } from "react-redux";

interface SelectYearProps{
    setYear: (v:number) => void;
    updateMonth:(v:number) => void;
    year: number;
    month: number;
    key: any;
}

function SelectYear(props:SelectYearProps){
    const year = useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    
    return (
        <div className="w11/12" key={props.key}> 
            <h1>Clone Budget From</h1>
        
            <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>
                {year} {months[month-1]}
            </h2>
            <h2>To</h2>
            <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>
                {props.year} {months[props.month-1]}
            </h2>
            <div className="p-2">
                <div className="inline-block mr-2 w-4/12 p-2">
                    <div> Year</div>
                    <input type="text" className="text-black mr-3 w-6/12 inline-block" value={props.year} onChange={()=>{}}/>
                    <div className='btn-minus w-1/12 inline-block p-1 mr-1' onClick={(e)=> props.setYear(props.year-1)}> -</div> 
                    <div className='btn-plus w-1/12 inline-block p-1'  onClick={(e)=> props.setYear(props.year+1)}> +</div> 
                </div>
                <div className="inline-block mr-2 w-4/12">
                    <div> Month</div>
                    <input type="text" className="text-black mr-3 w-6/12 inline-block" value={props.month} min={1} onChange={()=>{}}/>
                    <div className='btn-minus w-1/12 inline-block p-1 mr-1' onClick={(e)=>  props.updateMonth(Number(props.month-1))}> -</div> 
                    <div className='btn-plus w-1/12 inline-block p-1' onClick={(e)=>  props.updateMonth(Number(props.month+1))}> +</div> 
                </div>
            </div>
        </div>
    )
}
export default SelectYear;