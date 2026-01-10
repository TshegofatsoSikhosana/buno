import { db } from "@/config/database.config";
import { GoalItem } from "@/model/models";
import { getRemainingTotal } from "@/util/utils";
import { get } from "http";

export class GoalsService {
  constructor() {}

  getActualTotal(incomes: GoalItem[]) {
    let amt: number = 0;
    for (let index = 0; index < incomes.length; index++) {
      const e = incomes[index];
      this.getEntriesByGoalId(Number(e.id))
        .toArray()
        .then((entries) => {
          for (let j = 0; j < entries.length; j++) {
            const entry = entries[j];
            amt += Number(entry.amount);
          }
        });
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
    const actualTotal = this.getActualTotal(goals);
    if (expectedTotal === 0 || actualTotal === 0) {
      return 0;
    }
    return (actualTotal / expectedTotal) * 100 + 0;
  }

  getEntriesByGoalId(goalId: number) {
    return db.goalEntry.where("goalId").equals(goalId);
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

  update(goal: GoalItem) {
    db.goals.put({ ...goal });
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
