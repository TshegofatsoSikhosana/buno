
'use client';

import { createContext, useContext,  useState } from "react";

const AppContext = createContext({})

const AppState = {
    year: Number,
    month: Number
}
export const AppContextProvider = ({ children }) => {
    const [state, setState] = useState({year: 2024,month:1});

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => useContext(AppContext);