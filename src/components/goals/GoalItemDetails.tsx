import {  GoalEntry, GoalItem} from "@/model/models";
import { budgetSelectors } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../shared/FormModal";
import { GoalsService } from "@/service/GoalsService";
import RowActions from "../shared/RowActions";
import { get } from "http";

interface GoalItemDetailsProps {
    open: boolean;
    setOpen: (b:boolean)=> void;
    item?: GoalItem;
    refresh: ()=> void;
}
 
function GoalItemDetails(props: GoalItemDetailsProps){

    const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<GoalEntry | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<number>(-1);
    const [goalEntries, setGoalEntries] = useState<GoalEntry[]>([]);
    const [entriesTotal, setEntriesTotal] = useState<number>(0);
    const [openForm,setOpenForm] = useState(false);
    const [hasErrors, setHasErrors] = useState<boolean>(true);
    const year = useSelector(budgetSelectors.getCurrentYear);
    const goalService = new GoalsService();

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

    function getGoalEntries(){
        if(props.item && props.item.id){
        goalService.getEntriesByGoalId(props.item.id as number).toArray().then((entries)=>{
                setGoalEntries(entries as GoalEntry[]);
                const total = goalService.getGoalEntriesTotal(entries as GoalEntry[]);
                setEntriesTotal(total);
            });
        }
    }

    function getEntriesTotal(){
        const total =selectedGoal ? goalService.getGoalContributionsTotal(selectedGoal) : 0;
        setEntriesTotal(total);
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
                saveGoalEntry({...item as GoalEntry})
            }
        }
        getGoalEntries();
        setOpenForm(false);
        props.refresh();
    }

    function saveGoalEntry(selectedItem: GoalEntry){
        if(selectedItem){

            let item = {...selectedItem};
            item.year = year;
            item.goalId = selectedGoal?.id as number;
            item.dateCreated = Date.now().toString();
            console.log("Saving...", item);

            goalService.addNewEntry({...item})
        }
        // props.setOpen(false);

    }

    function handleEditGoalEntry(selectedItem: GoalEntry){
        if(selectedItem){
            goalService.updateEntry( {...selectedItem})
        }
        props.setOpen(false);
        props.refresh();
    }

    function deleteItem(index: number){
        // if(filteredIncomes && Number(selectedItem) >= 0 ){
        //     console.log('deleting', filteredIncomes[index])
        //     goalService.delete(Number(filteredIncomes[index].id))
        //     // getIncomes();
        // }
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
                            <div className='w-11/12 grid-flow-row font-bold'> 
                                <div className='w-6/12 p-2 inline-block' >
                                    <h1 style={{fontSize:'32px', color:'white'}}>🎯 {selectedGoal?.name}</h1>
                                </div>
                                <div className="w-100">
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
                            <div className='w-11/12 grid-flow-row font-bold' > 
                                <div className='w-6/12 p-2 inline-block' >
                                </div>
                                <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                                        Target
                                    </div>
                                    <div className='w-3/12 p-2 inline-block text-center' style={{border: '1px solid rgb(70, 70, 80,180)'}} >
                                        Actual
                                </div>
                            </div>
                            <div className='w-11/12 grid-flow-row '>
                                <div className='w-6/12 text-start grid-flow-row inline-block'> 
                                    {/* <FilterSelector filterType={filterType} setFilterType={setFilterType}/> */}
                                </div>
                                <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                    R{selectedGoal?.targetAmount}
                                </div>
                                <div className='w-3/12 p-2 inline-block text-start font-bold' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}} >
                                    R{entriesTotal}
                                </div>
                            </div>
                             <div className='w-100 grid-flow-row mt-5 ' >
                                {goalEntries.map((entry, index)=>{
                                    return <div className='w-11/12 grid-flow-row row-text-block'
                                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                                key={index}
                                                onClick={(e)=> setSelectedEntry(index+1)}
                                                onMouseLeave={(e)=> setSelectedEntry(-1)}>
                                                <div className='w-1/12 inline-block text-center' > 
                                                {Number(selectedEntry) - 1 === index ? 
                                                    (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                                    : <></>
                                                }
                                                </div>
                                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{entry.id}</div>
                                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{entry.amount}</div>
                                                <div className='w-3/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> {entry.month}</div>
                                        </div>
                                })}
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
                                                    {selectedItem && selectedItem.id ? 'Edit'  : 'Add'} Goal
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