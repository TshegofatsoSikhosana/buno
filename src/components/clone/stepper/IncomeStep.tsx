
import { getProjectedTotal, months } from "@/util/utils";
import { IncomeService } from "@/service/IncomeService";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";


interface IncomeStepProps{
    year: number;
    month: number;
}


function IncomeStep(props:IncomeStepProps) {

    const is = new IncomeService();

    const filteredIncomes = useSelector(budgetSelectors.getCloneIncomes)

    return ( <div>

                <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>

                {props.year} {months[props.month-1]}
            </h2>
            <h1>Income Projection</h1>

                <div className='w-11/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' >
                        
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Expected Total
                    </div>
                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        R{getProjectedTotal(filteredIncomes)}
                    </div>
                </div>
                {filteredIncomes?.map((incomeItem, index)=>{
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

export default IncomeStep;