import { db } from "@/config/database.config";
import { GoalEntry, GoalItem } from "@/model/models";
import { getRemainingTotal } from "@/util/utils";
import { get } from "http";

export class GoalsService {
  constructor() {}

  getContributionsTotal(goals: GoalItem[]) {
    let amt: number = 0;
    
    for (let index = 0; index < goals.length; index++) {
      const goal = goals[index];
      amt += this.getGoalContributionsTotal(goal);
    }
    
    return amt;
  }

  getGoalContributionsTotal(goal: GoalItem) {
    let amt: number = 0;
    const entries = goal.entries;

    if(entries){
      return this.getGoalEntriesTotal(entries);
    }
    return amt;
  }

  getGoalEntriesTotal(entries: GoalEntry[]) {
    let amt: number = 0;

    for (let j = 0; j < entries.length; j++) {
      const entry = entries[j];
      if(entry && entry.amount){
        amt += Number(entry.amount);
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

  async getGoals(year: number){
    const goals =  await db.goals.where({targetYear: year}).toArray();
    for (let index = 0; index < goals.length; index++) {
      const goal = goals[index];
      const entries = await this.getEntriesByGoalId(goal.id as number).toArray();
      goal.entries = entries;
    }
    return goals;
  }

  getEntriesByGoalId(goalId: number) {
    return db.goalEntry.where({goalId : goalId} );
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

  addNew(goal: GoalItem) {
    db.goals.add(goal);
  }

  addNewEntry(entry: GoalEntry) {
    db.goalEntry.add(entry);
  }


  update(goal: GoalItem) {
    db.goals.put({ ...goal });
  }

  updateEntry(entry: GoalEntry) {
    db.goalEntry.put({ ...entry });
  }

  delete(id: number) {
    db.goals.delete(id);
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
