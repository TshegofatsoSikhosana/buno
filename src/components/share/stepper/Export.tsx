import { db } from '@/config/database.config';
import React, { useEffect, useRef, useState } from 'react';

function Export(){
    const [backup, setBackup] = useState<any>();

    const downloadLinkRef = useRef<any>(null);

    async function getBackups(){
        let expenses = await  db.expenses.toArray();
        expenses = expenses.sort((a,b) => (a?.year || 0) - (b?.year || 0))
        let incomes = await db.income.toArray();
        incomes = incomes.sort((a,b) => (a?.year || 0) - (b?.year || 0))
        let investments = await db.investments.toArray();
        investments = investments.sort((a,b) => (a?.year || 0) - (b?.year || 0));
        let groceries = await db.groceries.toArray();
        groceries = groceries.sort((a,b) => (a?.year || 0) - (b?.year || 0));

        const data = { expenses, groceries, investments, incomes}
        console.log('Data', data);
        setBackup(data)
        
    }

    useEffect(()=>{
        getBackups()
    },[])

    const handleDownload = () => {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    if(downloadLinkRef?.current){
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download  = 'data.json';
        downloadLinkRef.current.click();
    }


    // Clean up
    URL.revokeObjectURL(url);
    }

    return (
        <div>
             <h2 className='font-bold text-stone-100 text-end inline-block' style={{fontSize: '36px'}}>
             Backup Your Data
                </h2>
                <div 
                    className='w-100 grid-flow-row row-text-block'
                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                    >
                    <div className='w-5/12 p-2 inline-block text-start'>
                        </div> 
                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                        Total
                    </div>
                 </div>
                <div 
                    className='w-100 grid-flow-row row-text-block'
                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                    >
                    <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                        Incomes 
                        </div> 
                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                        {backup?.incomes?.length} entries 
                    </div>
                 </div>
                 <div 
                    className='w-100 grid-flow-row row-text-block'
                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                    >
                    <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                        Investments
                        </div>
                    <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                        {backup?.investments?.length} entries
                    </div>
                </div>
                <div 
                    className='w-100 grid-flow-row row-text-block'
                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                    >
                        <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            Expenses
                        </div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            {backup?.expenses?.length} entries
                        </div>
                </div>
                <div 
                    className='w-100 grid-flow-row row-text-block'
                    style={{border: '1px solid rgb(70, 70, 80,180)'}}
                    >
                        <div className='w-5/12 p-2 inline-block text-start' style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            Groceries 
                        </div>
                        <div className='w-3/12 p-2 inline-block text-start'  style={{borderLeft: '2px solid rgb(70, 70, 80,180)'}}>
                            {backup?.groceries?.length} entries
                        </div>
                    </div>
                        <button style={{backgroundColor:'rgba(42,169,42)',borderRadius:'10px'}} className="btn-add p-3 mt-3  w-3/12" onClick={handleDownload}>
                            <a ref={downloadLinkRef} style={{ display: 'none' }}></a>
                            Download
                        </button>
        </div>
    );
}

export default Export;
