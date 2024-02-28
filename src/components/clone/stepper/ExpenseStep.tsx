import RowActions from "@/components/RowActions";
import { ExpenseItem } from "@/model/models";
import { ExpenseService } from "@/service/ExpenseService";
import { getProjectedTotal, months } from "@/util/utils";
import { budgetSelectors } from "@/store";
import { useSelector } from "react-redux";

interface ExpenseStepProps{
    year: number;
    month: number;
    key: any;
}



function ExpenseStep(props:ExpenseStepProps) {

    const es = new ExpenseService();

    const filteredExpenses = useSelector(budgetSelectors.getCloneExpenses)

    return ( <div key={props.key}>

                <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>

                {props.year} {months[props.month-1]}
            </h2>
            <h1>Expenses Projection</h1>

                <div className='w-11/12 grid-flow-row font-bold' style={{color:'rgb(30,150,222,255)'}}> 
                    <div className='w-6/12 p-2 inline-block' >
                        
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        Expected
                    </div>
                    <div className='w-3/12 p-2 inline-block text-start' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                        R{getProjectedTotal(filteredExpenses as ExpenseItem[])}
                    </div>
                </div>
                {filteredExpenses?.map((expense, index)=>{
                    return <div 
                                className='w-11/12 grid-flow-row row-text-block'
                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                key={index}
                                // onClick={(e)=> handleItemClick(index,ExpenseCategory.LIVING)}
                                // onMouseLeave={(e)=> handleItemClick(-1)}
                                >
                                    <div className='w-1/12 inline-block text-center' > 
                                    {/* {Number(selectedItem) - 1 === index  && isSelected(ExpenseCategory.LIVING) ?  */}
{/*                                     
                                    <div className="justify-center mt-2">
                                        <button className="inline-block"
                                         onClick={(e) => props.deleteItem(props.index)}
                                        >
                                            <Image alt="delete" src={deleteSvg} height={25} width={25} className="btn-delete"/>
                                        </button>
                                    </div> */}
                                        {/* : <></>
                                    } */}
                                    </div>
                                    <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                        {expense.description}
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                                        R{expense.expectedAmount}
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-start'  > 
                                    </div>
                                    
                </div>
                })}
    </div> );
}

export default ExpenseStep;