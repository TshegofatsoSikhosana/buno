import { db } from "@/config/database.config";
import { BusinessItem, BusinessIncomeItem, GoalEntry, GoalItem, BusinessExpenseItem } from "@/model/models";
import { getRemainingTotal } from "@/util/utils";
import { get } from "http";

export class BusinessService {
  constructor() {}

  // getContributionsTotal(goals: GoalItem[]) {
  //   let amt: number = 0;
    
  //   for (let index = 0; index < goals.length; index++) {
  //     const goal = goals[index];
  //     amt += this.getGoalContributionsTotal(goal);
  //   }
    
  //   return amt;
  // }

  // getGoalContributionsTotal(goal: BusinessExpectedItem) {
  //   let amt: number = 0;
  //   const entries = goal.;

  //   if(entries){
  //     return this.getPaymentEntriesTotal(entries);
  //   }
  //   return amt;
  // }

  getEntriesTotal(entries: BusinessItem[]) {
    let amt: number = 0;

    for (let j = 0; j < entries.length; j++) {
      const entry = entries[j];
      // if(entry && entry.amount){
      //   amt += Number(entry.amount);
      // }
    }
    return amt;
  }

  getPaymentEntriesTotal(entries: BusinessItem[]) {
    let amt: number = 0;

    for (let j = 0; j < entries.length; j++) {
      const entry = entries[j];
      if(entry && entry.incomeItems){
        for (let i = 0; i < entry.incomeItems?.length; i++) {
          const payment = entry.incomeItems[i];
          amt += Number(payment.amount);
        }
      }
    }
    return amt;
  }

  getExpectedTotal(incomes: GoalItem[]) {
    let amt: number = 0;
    for (let index = 0; index < incomes.length; index++) {
      const e = incomes[index];
      amt += Number(e.targetAmount);
    }

    return amt;
  }

   async getBusinesses(){
    const businesses =  await db.businesses.toArray();
    for (let index = 0; index < businesses.length; index++) {
      const business = businesses[index];
      const expenses = await this.getExpenseEntriesByBusinessId(business.id as number).toArray();
      const incomes = await this.getIncomeEntriesByBusinessId(business.id as number).toArray();
      business.expenseItems = expenses;
      business.incomeItems = incomes;
    }
    return businesses;
  }

  async getBusinessEntries(id: number){
    const expectedEntries = await this.getBusinesses()
    for (let index = 0; index < expectedEntries.length; index++) {
      const expectedEntry = expectedEntries[index];
      const paymentEntries = await this.getIncomeEntriesByBusinessId(expectedEntry.id as number).toArray();
      // expectedEntry.payments = paymentEntries;
    }
    return expectedEntries;
  }

  getIncomeEntriesByBusinessId(businessId: number) {
    return db.businessIncomeEntry.where({businessId : businessId} );
  }

  getExpenseEntriesByBusinessId(businessId: number) {
    return db.businessExpenseEntry.where({businessId : businessId} );
  }


  addNew(goal: BusinessItem) {
    db.businesses.add(goal);
  }

  addNewPaymentEntry(entry: BusinessIncomeItem) {
    db.businessIncomeEntry.add(entry);
  }

   addNewExpenseEntry(entry: BusinessExpenseItem) {
    db.businessExpenseEntry.add(entry);
  }


  update(goal: BusinessItem) {
    db.businesses.put({ ...goal });
  }

  updateEntry(entry: GoalEntry) {
    db.goalEntry.put({ ...entry });
  }


  updatePaymentEntry(entry: BusinessIncomeItem) {
    db.businessIncomeEntry.put({ ...entry });
  }

  updateExpenseEntry(entry: BusinessExpenseItem) {
    db.businessExpenseEntry.put({ ...entry });
  }

  delete(id: number) {
    db.goalEntry.where({goalId: id}).delete();
    db.goals.delete(id);
  }

  deleteEntry(id: number) {
    db.goalEntry.delete(id);
  }

  initializeWithTemplate() {
    const incomes: GoalItem[] = [
      {
        name: "Psybergate",
        targetAmount: 26360,
        dateCreated: Date.now().toString(),
        targetYear: 2023,
      },
    ];
    db.goals.bulkAdd([...incomes]);
  }
}
