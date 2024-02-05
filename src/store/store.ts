import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { BUDGET_KEY_FEATURE, budgetReducer } from './budget.slice';


const rootReducer = combineReducers({
    [BUDGET_KEY_FEATURE]: budgetReducer
})


  const store = configureStore({
    reducer: rootReducer
  });

  export type RootState = ReturnType<typeof store.getState>

  export type AppDispatch = typeof store.dispatch;
  
  export default store