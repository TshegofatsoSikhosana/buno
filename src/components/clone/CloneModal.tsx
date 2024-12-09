import { BudgetService } from "@/service/BudgetService";
import { useEffect, useState } from "react";
import closeSvg from '../../assets/close.svg'
import Image from "next/image";
import SelectYear from "./stepper/SelectYear";
import ExpenseStep from "./stepper/ExpenseStep";
import IncomeStep from "./stepper/IncomeStep";
import InvestmentStep from "./stepper/InvestmentStep";
import GroceriesStep from "./stepper/GroceriesStep";
import { useAppDispatch } from "@/store/hooks";
import { budgetActions, budgetSelectors } from "@/store";
import { useSelector } from "react-redux";


interface SimpleDialogProps{
    open: boolean;
    setOpen: (v:boolean)=> void;
}

function CloneModal(props:SimpleDialogProps){
  const bs = new BudgetService();

  const budget = useSelector(budgetSelectors.getCloneBudget);
  const budgetYear= useSelector(budgetSelectors.getCurrentYear);
  const budgetMonth = useSelector(budgetSelectors.getCurrentMonth);
  const dispatch = useAppDispatch();
  const [year, setYear] = useState<number>(budgetYear);
  const [month,setMonth] = useState<number>(budgetMonth);
 

  const [stepIndex,setStepIndex] = useState(0);

  const steps = [
    <SelectYear month={month} updateMonth={updateMonth} year={year} setYear={setYear} key="select-year-step"/>,
    <IncomeStep month={month}  year={year} key="income-step"/>,
    <ExpenseStep month={month}  year={year} key="expense-step"/>,
    <InvestmentStep month={month}  year={year} key="investment-step"/>,
    <GroceriesStep month={month}  year={year} key="groceries-step"/>,
  ]

  useEffect(()=>{
    const nextMonth = budgetMonth+1;
    bs.initializeBudgetClone( budgetYear,budgetMonth, budgetYear, Number(nextMonth)).then((budgetClone)=>{
      dispatch(budgetActions.setCloneBudget(budgetClone)) 
    });
  },[budgetYear,budgetMonth]);

 useEffect(()=>{
  if(budgetMonth === 12){
    setYear(budgetYear+1)
    setMonth(1)
  }
  else{
    updateMonth(budgetMonth+1)
  }
  
 },[budgetYear, budgetMonth])

 
  const handleClose = () => {
    props.setOpen(false);
    dispatch(budgetActions.resetCloneBudget()) 
    setStepIndex(0)
    setMonth(1);
    setYear(2024)
  }

  function updateMonth(month:number){
    if(month > 0 && month <= 12){
        setMonth(month)
    }
  }

  function updateStep(step:number){
   if(step === steps.length){
      bs.cloneBudget(budget)
          .then((res)=>{
            handleClose();
            dispatch(budgetActions.setCurrentYear(year))
            dispatch(budgetActions.setCurrentMonth(month))
          });
    }

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
                    <div className="modal">
                      <div className="h-90 text-center overflow-y-scroll">
                          {steps[stepIndex]}

                          <div className="inline-block mr-2 w-4/12 p-2" >
                                <button className="btn-add-item p-3 mt-2 w-8/12" style={{borderRadius:'20px'}} onClick={(e)=> updateStep(stepIndex+1)}>
                                { stepIndex < steps.length-1 ?  'Continue' : 'Clone' } 
                                </button>
                              { stepIndex !== 0 && 
                                  <button className="btn-add p-3 mt-2 w-8/12" style={{borderRadius:'20px'}} onClick={(e)=> updateStep(stepIndex-1)}>
                                      Back
                                  </button>
                              }
                          </div>
                        </div>
                    </div>
                </div>
        </dialog>
    </>
  );
};

export default CloneModal;