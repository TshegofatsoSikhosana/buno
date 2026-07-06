import { db } from "@/config/database.config";
import {GroceryItem, Store } from "@/model/models";
import { useEffect, useState } from "react";
import GroceryItemForm from "./GroceryItemForm";
import { GroceryService } from "@/service/GroceryService";
import Image from "next/image";
import RowActions from "../shared/RowActions";
import FilterSelector from "../shared/FilterSelector";
import { filterItems } from "@/util/utils";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";

interface GroceryProps {
}
 
function Groceries(props: GroceryProps){

    const year= useSelector(budgetSelectors.getCurrentYear);
    const month = useSelector(budgetSelectors.getCurrentMonth);

    const [openForm,setOpenForm] = useState(false);
    const [groceries,setGroceries]  = useState<GroceryItem[]>([]);
    const [filterType,setFilterType] = useState<number>(-1);
    const [filteredGroceries, setFilteredGroceries] = useState<GroceryItem[]>()
    const [selectedItem,setSelectedItem] = useState<number>(-1);
    
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
    },[month,year]);
    

    async function getGroceries(){
        db.groceries.where({year: year})
        .and((i)=> Number(i.month) == month)
        .toArray()
        .then((ex)=> {
            setGroceries([...ex]);
        });

        // let storeSet = new Set();
        // const all: GroceryItem[] = []
        // await db.groceries.toArray().then(groceries =>{
        //     groceries.forEach((g)=>{    
        //         g.store && storeSet.add((g.store + "").trim())
        //         all.push(g)
        //     })
            
        // })
        // const stores = Array.from(storeSet).sort((a,b)=> (a+"").toLowerCase().localeCompare((b+"").toLowerCase()));

        // console.log('Stores', stores);
        // console.log('Groceries', all.length);

        // all.forEach((g)=>{
        //     const store = (g.store + "").toLowerCase().trim();
        //     if(store === 'checkers'){
        //         g.store = Store.CHECKERS;
        //     }
        //     else if(store === 'picknpay' || store === 'pnp'){
        //         g.store = Store.PNP;
        //     }
        //     else if(store === 'foodlovers' || store === 'food lovers' || store === 'flm' || store === 'fruit and veg'){
        //         g.store = Store.FOODLOVERS;
        //     }
        //     else if(store === 'pep' || store === 'pep home'){
        //         g.store = Store.PEP;
        //     }
        //     else if(store === 'dischem'){ 
        //         g.store = Store.DISCHEM;
        //     }
        //     else if(store === 'woolworths' || store === 'woolies'){
        //         g.store = Store.WOOLWORTHS;
        //     }
        //     else if(store === 'clicks'){
        //         g.store = Store.CLICKS;
        //     }
        //     else if(store === 'all' || store === 'mixed'){
        //         g.store = Store.ALL;
        //     }
        //     else{
        //         g.store = Store.OTHER;
        //     }
        // })

        // storeSet = new Set();
        // all.forEach((g)=>{    
        //     g.store && storeSet.add((g.store + "").trim())
        // })
        
        // const stores2 = Array.from(storeSet).sort((a,b)=> (a+"").toLowerCase().localeCompare((b+"").toLowerCase()));
        // db.groceries.bulkPut(all).then(()=>{})
    }

    function close(v:boolean){
        setOpenForm(v);
        setSelectedItem(-1);
    }

    return <div className="dashboard-container">
                <button
                    className="p-2 mb-2 btn-add"
                    onClick={(e)=> setOpenForm(true)}>
                        {"Add Grocery Item"}
                </button>
                {openForm && (
                        <GroceryItemForm 
                            open={openForm}
                            setOpen={close}
                            refresh={getGroceries}
                            item={filteredGroceries && Number(selectedItem) >= 0 ? filteredGroceries[selectedItem-1] : undefined}
                    />)
                }
            
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
        </div>;
}
 
export default Groceries;