import { db } from "@/config/database.config";
import { GoalItem, IncomeItem } from "@/model/models";
import { useEffect, useState } from "react";
import { IncomeService } from "@/service/IncomeService";
import RowActions from "../shared/RowActions";
import FilterSelector from "../shared/FilterSelector";
import { filterItems } from "@/util/utils";
import Image from "next/image";
import closeSvg from "../../assets/close.svg";
import { useSelector } from "react-redux";
import { budgetSelectors } from "@/store";
import GoalItemEditForm from "./GoalItemEditForm";
import { GoalsService } from "@/service/GoalsService";
import GoalListItem from "./GoalListItem";
import { get } from "http";

function Goals() {
  const year = useSelector(budgetSelectors.getCurrentYear);
  const month = useSelector(budgetSelectors.getCurrentMonth);
  const [openForm, setOpenForm] = useState(false);

  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [totalContributionPercentage, setTotalContributionPercentage] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const [filterType, setFilterType] = useState<number>(-1);
  const [filteredGoals, setFilteredGoals] = useState<GoalItem[]>();
  const goalsService = new GoalsService();

  useEffect(() => {
    if (goals) {
      const g = filterItems(filterType, goals);
      setFilteredGoals([...g]);
    }
  }, [filterType, goals]);

  useEffect(() => {
    getGoals();
  }, [month, year]);

  async function getGoals() {
    const goals = await goalsService.getGoals(year);
    
    setGoals([...goals]);
    const percentage = goalsService.getTotalContributionPercentage([...goals]);
    setTotalContributionPercentage(percentage);
    const contributions = goalsService.getContributionsTotal([...goals]);
    setTotalContributions(contributions);
  }


  function getTargetTotal() {
    return filteredGoals ? goalsService.getExpectedTotal(filteredGoals) : 0;
  }

  function deleteItem(index: number) {
    if (filteredGoals && Number(selectedItem) >= 0) {
      console.log("deleting", filteredGoals[index]);
      goalsService.delete(Number(filteredGoals[index].id));
      getGoals();
    }
  }

  function close(v: boolean) {
    setOpenForm(v);
    setSelectedItem(-1);
  }

  return (
    <div className="dashboard-container">
      <div className="w-100 p-5">
        <div
          className="w-11/12 grid-flow-row font-bold"
          style={{ color: "rgb(30,150,222,255)", padding: "1rem" }}
        >
          <div
            className="w-4/12 inline-block font-bold"
            style={{ fontSize: "32px" }}
          >
            Your {year} Saving Goals 🎯
          </div>
          <div className="w-6/12 inline-block ">
            <div className="w-100 font-bold goal-progress-bar-container">
              <div
                className="inline-block mr-5 goal-progress"
                style={{
                  border: "2px solid rgba(0, 128, 0, 0.75)",
                  backgroundColor: "rgba(0, 128, 0, 0.75)",
                  color: "white",
                  width: `${totalContributionPercentage}%`,
                }}
              >
                <div className="pl-2">{totalContributionPercentage}%</div>
            </div>
          </div>
            
          </div>
        </div>
        <div className="p-2 mt-2">
          <div className="inline-block mr-5 w-2/12 total-card">
            <h1>Total Target</h1>
            <div>R{getTargetTotal()}</div>
          </div>
          <div className="inline-block mr-5 w-2/12 total-card">
            <h1>Total Contributions</h1>
            <div>R{totalContributions}</div>
          </div>
        </div>
        <div className="p-2 mt-2">
          <button
            className="p-2 mb-2 btn-add"
            onClick={(e) => setOpenForm(true)}
          >
            Add New Goal
          </button>
          {openForm && (
            <GoalItemEditForm
              open={openForm}
              setOpen={close}
              refresh={getGoals}
              item={
                goals && Number(selectedItem) >= 0
                  ? goals[selectedItem - 1]
                  : undefined
              }
            />
          )}
        </div>
        <div className="font-bold mt-2">
            Total Goals: {filteredGoals ? filteredGoals.length : 0}
        </div>
        <div className="w-100 grid-flow-row mt-5 ">
          {filteredGoals?.map((goal, index) => {
            return <GoalListItem 
                      key={index}
                      goal={goal}
                      index={index}
                      refresh={getGoals}
                      totalContributions={goalsService.getGoalContributionsTotal(goal)} />
          })}
        </div>
      </div>
    </div>
  );
}

export default Goals;
