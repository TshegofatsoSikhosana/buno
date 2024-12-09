import { budgetActions, budgetSelectors } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import Image from 'next/image';
import React, { useState } from 'react';
import closeSvg from '../../../assets/close.svg';
import { useSelector } from 'react-redux';
import { months } from '@/util/utils';


function DatePicker() {

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);
    const [openForm,setOpenForm] = useState(false);
    const dispatch = useAppDispatch();

    function updateYear(year:number){
        dispatch(budgetActions.setCurrentYear(year))
      }
    
      function updateMonth(month:number){
        if(month > 0 && month <= 12){
          dispatch(budgetActions.setCurrentMonth(month))
        }
      }
    
    return (
        <>
            {!openForm ? 
            <button 
                className="p-4 btn-add"
                onClick={() => setOpenForm(!openForm)}
                style={{borderRadius: '8px'}}>
                <h5 className="">
                    {year} {months[month-1]} Budget 
                </h5>
            </button>: <></>}
            <div className="inline-block w-5/12 p-2">
                {openForm ? 
                    <>
                    <div className="p-2 ">
                        <div className="inline-block mr-2 w-4/12 p-2">
                            <div> Year</div>
                            <input type="text" className="text-black mr-3 w-6/12 inline-block" value={year} />
                            <div className='btn-minus w-1/12 inline-block p-1 mr-1' onClick={(e)=> updateYear(year-1)}> -</div> 
                            <div className='btn-plus w-1/12 inline-block p-1'  onClick={(e)=> updateYear(year+1)}> +</div> 
                        </div>
                        <div className="inline-block mr-2 w-4/12">
                            <div> Month</div>
                            <input type="text" className="text-black mr-3 w-6/12 inline-block" value={month} />
                            <div className='btn-minus w-1/12 inline-block p-1 mr-1' onClick={(e)=>  updateMonth(Number(month-1))}> -</div> 
                            <div className='btn-plus w-1/12 inline-block p-1' onClick={(e)=>  updateMonth(Number(month+1))}> +</div> 
                        </div>
                        <div className="w-2/12 inline-block" onClick={()=> setOpenForm(false)}>
                        <Image alt="delete"
                            src={closeSvg}
                            height={20} width={20}
                            className="inline"/>
                        <div className="inline text-slate-600 btn-close">CLOSE</div>
                    </div>
                    </div>
                    </>: <>
                    
                    </>
                }
            </div>
        </>
    )
}

export default DatePicker;
