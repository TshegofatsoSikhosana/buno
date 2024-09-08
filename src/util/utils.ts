export function stillNeedToPay(data:any[]){
    return data?.filter((e)=> e.actualAmount <= 0)
}

export function unexpectedItems(data:any[]){
    return data?.filter((e)=> e.expectedAmount <= 0)
}

export function overSpentItems(data:any[]){
    return data?.filter((e)=> !(e.expectedAmount <= 0) && e.expectedAmount - e.actualAmount < 0);
}

export function discountedItems(data:any[]){
    return data?.filter((e)=> e.discountAmount && e.discountAmount > 0);
}

export function savedItems(data:any[]){
    return data?.filter((e)=>!(e.actualAmount <= 0) && e.expectedAmount - e.actualAmount  > 0);
}


export function getRemainingTotal(items: any[]){
    let amt:number = 0;
    let expected: number= 0;
    if(items){
        for (let index = 0; index < items.length; index++) {
            const e = items[index];
            amt += Number(e.actualAmount);
            expected += Number(e.expectedAmount)
        }
    }
    return expected - amt
}

export function getActualTotal(items: any[]){
    let amt:number = 0;
    if(items){
        for (let index = 0; index < items.length; index++) {
            const e = items[index];
            amt += Number(e.actualAmount);
        }
    }
    return amt
}

export function getExpectedTotal(items: any[]){
    let amt:number = 0;
    if(items){
        for (let index = 0; index < items.length; index++) {
            const e = items[index];
            amt += Number(e.expectedAmount);
        }
    }
    return amt
}

export function getProjectedTotal(items: any[]){
    let expected: number= 0;
    if(items){
        for (let index = 0; index < items.length; index++) {
            const e = items[index];
            expected += Number(e.expectedAmount)
        }
    }
    return expected
}


export function filterItems(filterType: FilterType,data:any[]){
    if(filterType === FilterType.STILL_NEED_TO_PAY){
        return stillNeedToPay(data);
    }
    else if(filterType === FilterType.UNEXPECTED){
        return unexpectedItems(data);
    }
    else if(filterType === FilterType.OVERSPENT){
        return overSpentItems(data);
    }
    else if(filterType === FilterType.DISCOUNTED){
        return discountedItems(data);
    }
    else if(filterType === FilterType.SAVED){
        return savedItems(data);
    }
    else{
        return data
    }
}

export enum FilterType{
    STILL_NEED_TO_PAY,
    UNEXPECTED,
    OVERSPENT,
    DISCOUNTED,
    SAVED
}
export function prepareCloneItems(data:any[], month:number,year:number){
    data.forEach((item)=>{
        item.year = year;
        item.month = month;
        item.actualAmount = 0;
        item.dateCreated = Date.now();
        item.id = undefined;
    })
    return data
}

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November" , "December"]


export const graphColors = [
    "#deedee",
    "#a33dee",
    "rgb(65, 194, 123)",
    "rgba(30, 148, 222)",
    "rgba(236,149,82)",
    "rgba(123,21,56)",
    "rgba(43,203,11)",
    "rgba(92,202,215)",
    "rgba(215,42,42)",
    "rgba(190,182,45)",
    "rgba(9,219,180)",
    "rgba(151,81,209)",
    "rgba(221,243,11)",
    "rgba(139,138,181)",
    "rgba(156,67,90)",
    "rgba(145,220,35)",
    "rgba(41,230,135)",
    "rgba(68,197,4)",
    "rgba(229,26,149)",
    "rgba(91,43,155)",
    "rgba(235,133,45)",
    "rgba(33,203,65)",
    "rgba(33,59,216)",
    "rgba(130,44,213)",
    "rgba(247,230,98)",
    "rgba(81,71,79)",
    "rgba(156,67,51)",
    "rgba(164,30,58)",
    "rgba(89,14,228)",
    "rgba(158,167,239)",
    "rgba(96,114,128)",
    "rgba(5,47,17)",
    "rgba(124,164,228)",
    "rgba(240,232,89)",
    "rgba(191,200,64)",
    "rgba(154,74,30)"
  ]