import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
import { graphColors } from '@/util/utils';
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
  );
ChartJS.register(ArcElement, Tooltip, Legend)
export interface ChartItem{
    colors: string[];
    values: number[];
    labels: string[];
}


interface DoughnutChartProps{
    colors: string[];
    values: number[];
    labels: string[];
    includeLabels?: boolean
 }
function DoughnutChart(data : DoughnutChartProps){

    return (
            <>{ data && <Doughnut data={{
                labels: data.labels,
                datasets: [{
                    borderWidth: 1,
                    data: data.values,
                    backgroundColor: graphColors,
                    }],
                }}
                options={{
                    color:"white",
                    plugins:{
                        legend: { display: data.includeLabels || false},
                        title: { text: 'Current Month', display: true, color: 'white'}
                    }
                }}/>
            }
        </>
    );
}

export default DoughnutChart;
