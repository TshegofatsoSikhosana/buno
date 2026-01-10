import {  GoalEntry, GoalItem} from "@/model/models";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../../shared/FormModal";
import { GoalsService } from "@/service/GoalsService";
import RowActions from "../../shared/RowActions";
import { get } from "http";
import { getMonth, months } from "@/util/utils";
import GoalItemDoughnutChart from "../GoalItemDoughnutChart";

interface GoalItemDetailsProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    item?: GoalItem;
    refresh: ()=> void;
}
 
function GoalItemDetails(props: GoalItemDetailsProps){

    const year = useSelector(budgetSelectors.getCurrentYear);
    const goalService = new GoalsService();

    const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<GoalEntry | null>(null);
    const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(-1);

    const [goalEntries, setGoalEntries] = useState<GoalEntry[]>([]);
    const [entriesTotal, setEntriesTotal] = useState<number>(0);
    const [percentageComplete, setPercentageComplete] = useState<number>(0);

    const [openForm,setOpenForm] = useState(false);
    const [hasErrors, setHasErrors] = useState<boolean>(true);

    useEffect(()=>{
        if(props.item){
            setSelectedGoal(props.item);
        }
    },[props.item]);

    useEffect(()=>{
        getGoalEntries();
    },[selectedGoal]);

    useEffect(()=>{
        validInputs();
    }, [selectedItem]);

    useEffect(()=>{
        const item =  goalEntries[selectedEntryIndex - 1];
        if(item){
            setSelectedItem({...item});
        }else{
            setSelectedItem(null);
        }
    },[selectedEntryIndex]);

    function getGoalEntries(){
        if(props.item && props.item.id){
            const target = props.item.targetAmount ? Number(props.item.targetAmount) : 0;
            goalService.getEntriesByGoalId(props.item.id as number).toArray().then((entries)=>{
                    setGoalEntries(entries as GoalEntry[]);
                    const total = goalService.getGoalEntriesTotal(entries as GoalEntry[]);
                    setEntriesTotal(total);
                    const percentage = target > 0 ? Number((total / target) * 100).toFixed(2) : 0;
                    setPercentageComplete(Number(percentage));
                });
        }
    }

    function updateItem(e:any,target: string){
        const value = e.target.value
        const item = {...selectedItem}
        //@ts-ignore
        item[target] = value;
        setSelectedItem(item as GoalEntry)
    }

    function handleAddGoalEntry(e:any){
        if(selectedItem && selectedItem.id){
           handleEditGoalEntry( {...selectedItem as GoalEntry})
        }else{
            const item = {...selectedItem}            
            if(item){
                handleSaveGoalEntry({...item as GoalEntry})
            }
        }
        getGoalEntries();
        setOpenForm(false);
        props.refresh();
    }

    function handleSaveGoalEntry(selectedItem: GoalEntry){
        if(selectedItem){
            let item = {...selectedItem};
            item.year = year;
            item.goalId = selectedGoal?.id as number;
            item.dateCreated = Date.now().toString();
            goalService.addNewEntry({...item})
        }
    }

    function handleEditGoalEntry(selectedItem: GoalEntry){
        if(selectedItem){
            goalService.updateEntry( {...selectedItem})
        }
    }

    function deleteItem(index: number){
        if(goalEntries && Number(selectedEntryIndex) >= 0 ){
            goalService.deleteEntry(Number(goalEntries[index].id))
            getGoalEntries(); 
        }
    }

    function validInputs(){
        if(selectedItem){
            if(Number(selectedItem.amount) >= 0 &&
                 Number(selectedItem.month) >= 0){
                    setHasErrors(false)
                    return;
            }
        }
        setHasErrors(true);
    }

    return (<>
            <FormModal
                open={props.open}
                onClose={props.setOpen}
                classes="dashboard-container"
                form={
                    <div className="p-2 w-100 ">
                        <div className="p-2">
                            <div className='w-100 grid-flow-row font-bold'> 
                                <div className='w-4/12 p-2 inline-block' >
                                    <h1 style={{fontSize:'32px', color:'white'}}>🎯 {selectedGoal?.name}</h1>
                                </div>
                                <div className="inline-block mr-5 w-2/12 total-card">
                                        <h1>Target</h1>
                                        <div>R{selectedGoal?.targetAmount}</div>
                                </div>
                                 <div className="inline-block mr-5 w-2/12 total-card">
                                        <h1>Contributed</h1>
                                        <div>R{entriesTotal}</div>
                                </div>
                                 <div className="w-3/12 inline-block m">
                                        <div className="w-100 font-bold goal-progress-bar-container">
                                            <div
                                                className="inline-block mr-5 goal-progress"
                                                style={{
                                                border: "2px solid rgba(0, 128, 0, 0.75)",
                                                backgroundColor: "rgba(0, 128, 0, 0.75)",
                                                color: "white",
                                                width: `${percentageComplete}%`,
                                                }}
                                            >
                                                <div className="pl-2">{percentageComplete}%</div>
                                            </div>
                                        </div>
                                    </div>
                                <div className="w-100 mt-5 mb-2">
                                    {!openForm && <button
                                        className="p-2 mb-2 btn-add"
                                        onClick={(e) => setOpenForm(true)}
                                    >
                                        Add Entry
                                    </button>}
                                </div>
                               
                            </div>
                            {!openForm ?
                            <>
                            <div className='w-100 grid-flow-row' >
                                <div className="w-10/12 inline-block">
                                    <div className='w-10/12 grid-flow-row inline-block' style={{border: '1px solid rgb(70, 70, 80,180)'}}>
                                        <div className='w-2/12 p-2 inline-block text-center' > </div>
                                        <div className='w-4/12 p-2 inline-block text-start font-bold' style={{borderLeft: '2px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                            Month
                                        </div>
                                        <div className='w-3/12 p-2 inline-block text-start font-bold' style={{borderLeft: '2px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                            Amount
                                        </div>
                                    </div>
                                   
                                    {goalEntries.map((entry, index)=>{
                                        return <div className='w-10/12 grid-flow-row row-text-block'
                                                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                                    key={index}
                                                    onClick={(e)=> setSelectedEntryIndex(index+1)}
                                                    onMouseLeave={(e)=> setSelectedEntryIndex(-1)}>
                                                    <div className='w-2/12 inline-block text-center' > 
                                                    {Number(selectedEntryIndex) - 1 === index ? 
                                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                                        : <></>
                                                    }
                                                    </div>
                                                    {/* <div className='w-2/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{entry.id}</div> */}
                                                    <div className='w-4/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> {getMonth(entry.month)}</div>
                                                    <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{entry.amount}</div>
                                            </div>
                                    })}
                                </div>
                                
                            </div>
                            </>
                            :
                            <>
                                <div className="p-2">
                                    <div className="p-2">
                                        <div className="inline-block mr-2 w-11/12">
                                            <div className="font-bold py-2">New entry:</div>
                                        </div>
                                        <div className="inline-block mr-2">
                                            <div> Amount</div>
                                            <input type="number" className="text-black" value={selectedItem?.amount}  onChange={(e)=> updateItem(e,'amount')}/>
                                        </div>
                                        <div className="inline-block mr-2">
                                            <div> Month</div>
                                            <input type="number" className="text-black" value={selectedItem?.month}  onChange={(e)=> updateItem(e,'month')}/>
                                        </div>
                                        </div>
                                        <div className="p-2">
                                            <button 
                                                className="inline-block bg-blue-500 p-2 w-100 btn-add-item"
                                                style={{borderRadius: '8px'}}
                                                disabled={hasErrors}
                                                onClick={handleAddGoalEntry}>
                                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Entry
                                                </button>
                                    </div>
                                </div> 
                            </>
                            }
                        </div>
                    </div> 
             }
             />
        </>);
}
 
export default GoalItemDetails;