import { db } from "@/config/database.config";
import {GroceryItem } from "@/model/models";
import { useEffect, useState } from "react";
import GroceryItemForm from "./GroceryItemForm";
import { GroceryService } from "@/service/GroceryService";
import Image from "next/image";
import RowActions from "../RowActions";
import FilterSelector from "../FilterSelector";
import { filterItems } from "@/app/util/utils";
import closeSvg from '../../assets/close.svg';
import { useAppContext } from "@/context/Context";

interface GroceryProps {
}
 
function Groceries(props: GroceryProps){

    // @ts-ignore:next-line
    const {state} = useAppContext();
    const [openForm,setOpenForm] = useState(false);
    const [groceries,setGroceries]  = useState<GroceryItem[]>([]);
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredGroceries, setFilteredGroceries] = useState<GroceryItem[]>()

    const gs = new GroceryService();
    
    function getActualTotal(){
        return filteredGroceries ? gs.getActualTotal(filteredGroceries) :  0
    }

    function getDiscountTotal(){
        return filteredGroceries ? gs.getDiscountTotal(filteredGroceries) : 0
    }

    function getExpectedTotal(){
        return filteredGroceries ? gs.getExpectedTotal(filteredGroceries) : 0
    }

    function handleAddGroceryItem(selectedItem: GroceryItem){
        if(selectedItem){
            let item = {...selectedItem};
            item.month = state.month.toString();
            item.year = state.year;
            item.dateCreated = Date.now().toString();
            gs.addNew( {...item})
        }
        setOpenForm(false)
        getGroceries();
    }

    function handleEditGroceryItem(selectedItem: GroceryItem){
        if(selectedItem){
            gs.update( {...selectedItem})
        }
        setOpenForm(false)
        getGroceries();
    }

    function deleteItem(index: number){
        if(filteredGroceries && Number(selectedItem) >= 0 ){
            console.log('deleting', filteredGroceries[index])
            gs.delete(Number(filteredGroceries[index].id))
            getGroceries();
        }
    }

    useEffect(()=>{
        if(groceries){
            const g = filterItems(filterType,groceries)
            setFilteredGroceries([...g])
        }
    },[filterType, groceries]);

    useEffect(()=>{
        getGroceries();
    },[state.month,state.year]);

    function getGroceries(){
        db.groceries.where({year: state.year})
        .and((i)=> Number(i.month) == state.month)
        .toArray()
        .then((ex)=> {
            setGroceries([...ex]);
        });
    }

    return <>
                { openForm ? <>
                                <div className="w-100 " onClick={()=> setOpenForm(false)}>
                                    <Image alt="delete"
                                        src={closeSvg}
                                        height={25} width={25}
                                        className="inline-block"/>
                                    <div className="inline-block text-slate-600 btn-close">CLOSE</div>
                                </div>
                                <GroceryItemForm 
                                    handleAddGroceryItem={handleAddGroceryItem}
                                    handleEditGroceryItem={handleEditGroceryItem}
                                    item={filteredGroceries && Number(selectedItem) >= 0 ? filteredGroceries[selectedItem-1] : undefined} />
                            
                            </>:( 
                                <button
                                    className="p-2 mb-2 btn-add"
                                    style={{borderRadius: '8px', border:'2px solid rgb(70, 70, 80,180)'}}
                                    onClick={(e)=> setOpenForm(true)}>Add Grocery Item</button>
                            )}
                <div>
                    <div className='w-6/12 text-end grid-flow-row p-2 font-bold inline-block'> 
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}}> 
                        Expected
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}}> 
                        Actual
                    </div>
                    <div className='w-2/12 text-center grid-flow-row p-2 font-bold inline-block' style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}}> 
                        Discount
                    </div>
                </div>
                <div>
                    <div className='w-6/12 text-start grid-flow-row inline-block'> 
                        <FilterSelector filterType={filterType} setFilterType={setFilterType}/>
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block'
                         style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}}> 
                        R{getExpectedTotal()}
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block'
                         style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}}> 
                        R{getActualTotal()}
                    </div>
                    <div className='w-2/12 text-start grid-flow-row p-2 font-bold inline-block' 
                         style={{border: '1px solid rgb(70, 70, 80,180)', color:'rgb(30,150,222,255)'}}> 
                        R{getDiscountTotal()}
                    </div>
                </div>
                <div className='w-100 grid-flow-row mt-5'>

                    {filteredGroceries && filteredGroceries.map((grocery, index)=>{
                        return <div 
                                className='w-100 grid-flow-row row-text-block'
                                style={{border: '1px solid rgb(70, 70, 80,180)'}}
                                key={index}
                                onClick={(e)=> setSelectedItem(index+1)}
                                onMouseLeave={(e)=> setSelectedItem(-1)}>
                                <div className='w-1/12 inline-block text-center' > 
                                    {Number(selectedItem) - 1 === index ? 
                                        (<RowActions deleteItem={deleteItem} setOpenForm={setOpenForm} index={index}/>)
                                        : <></>
                                    }
                                </div>
                                <div className='w-5/12 p-2 inline-block' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>{grocery.description}</div>
                                <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{grocery.expectedAmount}</div>
                                <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{grocery.actualAmount}</div>
                                <div className='w-2/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}> R{grocery.discountAmount}</div>
                            </div>
                    })}
                </div>
        </>;
}
 
export default Groceries;