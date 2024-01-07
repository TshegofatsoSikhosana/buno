export function stillNeedToPay(data:any[]){
    return data?.filter((e)=> e.actualAmount <= 0)
}

export function unexpectedItems(data:any[]){
    return data?.filter((e)=> e.expectedAmount <= 0)
}

export function overSpentItems(data:any[]){
    return data?.filter((e)=> !(e.expectedAmount <= 0) && e.actualAmount > e.expectedAmount);
}

export function discountedItems(data:any[]){
    return data?.filter((e)=> e.discountAmount && e.discountAmount > 0);
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
    else{
        return data
    }
}

export enum FilterType{
    STILL_NEED_TO_PAY,
    UNEXPECTED,
    OVERSPENT,
    DISCOUNTED
}