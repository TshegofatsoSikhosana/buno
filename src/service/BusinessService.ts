import { db } from "@/config/database.config";
import { BusinessExpectedItem, BusinessItem, BusinessPaymentItem, GoalEntry, GoalItem } from "@/model/models";
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

  getEntriesTotal(entries: BusinessExpectedItem[]) {
    let amt: number = 0;

    for (let j = 0; j < entries.length; j++) {
      const entry = entries[j];
      if(entry && entry.amount){
        amt += Number(entry.amount);
      }
    }
    return amt;
  }

  getPaymentEntriesTotal(entries: BusinessExpectedItem[]) {
    let amt: number = 0;

    for (let j = 0; j < entries.length; j++) {
      const entry = entries[j];
      if(entry && entry.payments){
        for (let i = 0; i < entry.payments?.length; i++) {
          const payment = entry.payments[i];
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

  getTotalContributionPercentage(goals: GoalItem[]) {
    if (!goals || goals.length === 0) {
      return 0;
    }

    const expectedTotal = this.getExpectedTotal(goals);
    const actualTotal = this.getContributionsTotal(goals);

    if (expectedTotal === 0 || actualTotal === 0) {
      return 0;
    }
    const percentage = (actualTotal / expectedTotal) * 100;
    return  Number(percentage.toFixed(2));
  }

   async getBusinesses(){
    const businesses =  await db.businesses.toArray();
    for (let index = 0; index < businesses.length; index++) {
      const business = businesses[index];
      const expectedEntries = await this.getExpectedEntriesByBusinessId(business.id as number).toArray();
      business.expectedItems = expectedEntries;
    }
    return businesses;
  }

  async getBusinessEntries(id: number){
    const expectedEntries = await this.getExpectedEntriesByBusinessId(id).toArray();
    for (let index = 0; index < expectedEntries.length; index++) {
      const expectedEntry = expectedEntries[index];
      const paymentEntries = await this.getPaymentEntriesByBusinessExpectedId(expectedEntry.id as number).toArray();
      expectedEntry.payments = paymentEntries;
    }
    return expectedEntries;
  }

  getExpectedEntriesByBusinessId(goalId: number) {
    return db.businessExpectedEntry.where({businessId : goalId} );
  }

  getPaymentEntriesByBusinessExpectedId(goalId: number) {
    return db.businessPaymentEntry.where({businessExpectedId : goalId} );
  }

  getEntriesTotalByGoalId(goalId?: number) {
    
    if(!goalId){
        return 0;
    }
    
    let total = 0
    
    this.getEntriesByGoalId(goalId).toArray().then((entries) => {
        entries.forEach((entry)=>{
            total += Number(entry.amount);
        })
    })

    return total;
  }

  addNew(goal: BusinessItem) {
    db.businesses.add(goal);
  }

  addNewExpectedEntry(entry: BusinessExpectedItem) {
    db.businessExpectedEntry.add(entry);
  }

  addNewPaymentEntry(entry: BusinessPaymentItem) {
    db.businessPaymentEntry.add(entry);
  }


  update(goal: BusinessItem) {
    db.businesses.put({ ...goal });
  }

  updateEntry(entry: GoalEntry) {
    db.goalEntry.put({ ...entry });
  }


  updatePaymentEntry(entry: BusinessPaymentItem) {
    db.businessPaymentEntry.put({ ...entry });
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
