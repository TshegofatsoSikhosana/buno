import { GoalItem } from "@/model/models";
import DoughnutChart from "../dashboard/doughnuts/DoughnutChart";


interface GoalItemDoughnutChartProps {
    totalContributions: number;
    totalTarget: number;
}

function GoalItemDoughnutChart({ totalContributions, totalTarget }: GoalItemDoughnutChartProps){

    return ( <>
    <DoughnutChart values={[totalContributions, totalTarget]}
        labels={['Contributed', 'Remaining']}
        colors={["rgb(65, 194, 123)","#deedee"]}
        title="Goal Progress"
    />
    </>);
}

export default GoalItemDoughnutChart;