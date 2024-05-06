import { ExpenseItem, GroceryItem } from '@/model/models';
import React, { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

interface BarChartProps{
   labels: string[];
   data: number[];
   title: string;
}
function BarChart(props: BarChartProps){

   function getScale(){
    const data = props.data.sort((a,b)=> b- a);
    if(data[0] < 10000){
      return ["100", "200","500","750","1000","2500","5000","100000" ]
    }

    return ["100", "200","500","750","1000","2500","7000" ]
   }
    return (
        <Bar data={{
            datasets: [{
                data: props.data,
                backgroundColor:["#deedee","#a33dee","rgb(65, 194, 123)","rgba(30, 148, 222)"],
                }]
            }}
            options={{
                layout:{padding:2},
                indexAxis: 'y' as const,
                color:"white",
                scales: {
                    yAxes:{
                      labels: props.labels,
                        ticks:{
                            color: 'white',
                        },
                    },
                    xAxes: {
                      beginAtZero: true,
                      ticks:{
                          color: 'white'
                      }, 
                      display: true,
                      grid:{
                          color: 'grey'
                      },
                    },
                },
                elements: {
                  bar: {
                    borderWidth: 2,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    display: false,
                    labels:{ 
                        color:'white'
                    },
                  },
                  title: {
                    display: true,
                    text: props.title,
                    color:'white'
                  },
                }}}/>
    );
}

export default BarChart;
