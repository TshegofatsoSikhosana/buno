
'use client';

import { createContext, useContext,  useEffect,  useState } from "react";

const AppContext = createContext({state: {year: 0,month:0}})

const AppState = {
    year: Number,
    month: Number
}
export const AppContextProvider = ({ children }) => {
    const [state, setState] = useState({year: 0,month:0});

    useEffect(()=>{
        const date = new Date();
        const s = {...state}
        s.month = date.getMonth()+1;
        s.year = date.getFullYear();
        setState({...s});
    },[])
    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => useContext(AppContext);