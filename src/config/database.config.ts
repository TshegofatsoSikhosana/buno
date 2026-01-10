import { ExpenseItem, GoalEntry, GoalItem, GroceryItem, IncomeItem, InvestmentItem } from '@/model/models';
import Dexie, { Table } from 'dexie';
// table inteface
export interface Student {
  id?: number;
  name: string;
  rollNumber: number;
}
export class DB extends Dexie {
// table name is student 
  expenses!: Table<ExpenseItem>; 
  investments!: Table<InvestmentItem>; 
  income!: Table<IncomeItem>; 
  groceries!: Table<GroceryItem>;
  goals!: Table<GoalItem>;
  goalEntry!: Table<GoalEntry>;

  constructor() {
    super('buno-db');
    this.version(2).stores({
      expenses: '++id, description, expectedAmount,  actualAmount, category, month, dateCreated, year' , 
      groceries: '++id, description, expectedAmount,  actualAmount, discountAmount,store, month, dateCreated, year' , 
      investments: '++id, description, expectedAmount,  actualAmount, bank, month, dateCreated, year'  ,
      income: '++id, description, expectedAmount,  actualAmount, bank, month, dateCreated, year',
      goals: '++id, name, targetAmount,  dateCreated, targetYear',
      goalEntry: '++id, goalId, amount, month, dateCreated, year'
    });
  }
}
export const db = new DB(); // export the db