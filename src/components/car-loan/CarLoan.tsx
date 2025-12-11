import { useState } from "react";
import IncomeItemForm from "../income/IncomeItemForm";
import CarLoanForm from "./CarLoanForm";
import { CarLoanItem } from "@/model/models";


function CarLoan() {
    const [openForm,setOpenForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CarLoanItem | null>(null);
    
    return ( 
    <div className='dashboard-container'>
        <button
                        className="p-2 mb-2 btn-add"
                        style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                        onClick={(e)=> setOpenForm(true)}>
                            Add Car Loan
                </button>
                { openForm &&
                        <CarLoanForm 
                            open={openForm}
                            setOpen={close}
                            refresh={()=> console.log("testing")}
                            // item={incomes && Number(selectedItem) >= 0 ? incomes[selectedItem-1] : undefined} />
                            item={undefined} />

                }   
    </div> );
}

export default CarLoan;