
import { getProjectedTotal, months } from "@/util/utils";
import { InvestmentService } from "@/service/InvestmentService";
import { useEffect, useState } from "react";


interface InvestmentStepProps{
    year: number;
    month: number;
}



function InvestmentStep(props:InvestmentStepProps) {

    const is = new InvestmentService();

    const [filteredInvestments,setFilteredInvestments] = useState([] as any[]);

    useEffect(()=>{
    is.clone(props.year,props.month).then((res)=>{
        setFilteredInvestments(res);
    });
    },[props])

    return ( <div>

                <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>

                {props.year} {months[props.month-1]}
            </h2>
            <h1>Investment Projection</h1>

                <div className='w-11/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' >
                        
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Expected Total
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        R{getProjectedTotal(filteredInvestments)}
                    </div>
                </div>
                {filteredInvestments?.map((incomeItem, index)=>{
                    return <div 
                                className='w-11/12 grid-flow-row row-text-block'
                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                key={index}
                                // onClick={(e)=> handleItemClick(index,ExpenseCategory.LIVING)}
                                // onMouseLeave={(e)=> handleItemClick(-1)}
                                >
                                    <div className='w-1/12 inline-block text-start' > 
                                    {/* {Number(selectedItem) - 1 === index  && isSelected(ExpenseCategory.LIVING) ? 
                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                        : <></>
                                    } */}
                                    </div>
                                    <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                        {incomeItem.description}
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                        R{incomeItem.expectedAmount}
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start'> 
                                    </div>
                                    
                </div>
                })}
    </div> );
}

export default InvestmentStep;