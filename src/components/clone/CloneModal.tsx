import { BudgetService } from "@/service/BudgetService";
import { useState } from "react";
import closeSvg from '../../assets/close.svg'
import Image from "next/image";
import SelectYear from "./stepper/SelectYear";
import ExpenseStep from "./stepper/ExpenseStep";
import IncomeStep from "./stepper/IncomeStep";


interface SimpleDialogProps{
    open: boolean;
    setOpen: (v:boolean)=> void;
}

function CloneModal(props:SimpleDialogProps){
  const bs = new BudgetService();

  const [year, setYear] = useState<number>(2024);
  const [month,setMonth] = useState<number>(1)
 
  const [stepIndex,setStepIndex] = useState(0);
  const steps = [
    <SelectYear month={month} updateMonth={updateMonth} year={year} setYear={setYear}/>,
    <IncomeStep month={month}  year={year} />,
    <ExpenseStep month={month}  year={year} />,
  ]
  const handleClose = () => {
    // console.log(bs.clone(2024,2));
    props.setOpen(false);
  }

  function updateMonth(month:number){
    if(month > 0 && month <= 12){
        setMonth(month)
    }
  }

  function updateStep(step:number){
    if(step >= 0 && step <= steps.length-1){
        setStepIndex(step)
    }
  }
  return (
    <>
            <dialog open={props.open} onClose={handleClose}
                style={{ padding:'10px'}}
            >
                <div
                    className="w-9/12 modal-wrapper">
                    <Image alt="edit" src={closeSvg} height={50} width={50} className=" btn-edit ml-2"  onClick={handleClose}/>
                    <div className="modal text-center">
                        {steps[stepIndex]}

                        <div className="inline-block mr-2 w-4/12 p-2" >
                            <button className="btn-add-item p-3 mt-2 w-8/12" style={{borderRadius:'20px'}} onClick={(e)=> updateStep(stepIndex+1)}>
                                Continue
                            </button>
                            { stepIndex !== 0 && 
                            <button className="btn-add p-3 mt-2 w-8/12" style={{borderRadius:'20px'}} onClick={(e)=> updateStep(stepIndex-1)}>
                                Back
                            </button>
                        }
                        </div>
                    </div>
                </div>
        </dialog>
    </>
  );
};

export default CloneModal;