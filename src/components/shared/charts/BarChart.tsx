import React from 'react';

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
import { graphColors } from '@/util/utils';

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

   function randomColor(){
    let color = '#'
    const tokens = 'abcdef012345678'.split('');


    for(let i = 0 ; i< 6; i++){
        const t = tokens[Math.floor(Math.random()*15)]      
        if(t)
        color = color + t;
    }
    const bgs = props.data.map( d => `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`);
    console.log(bgs);
    return '';
   }

   const backgrounds = [
    "rgba(236,149,82)",
    "rgba(123,21,56)",
    "rgba(43,203,11)",
    "rgba(92,202,215)",
    "rgba(215,42,42)",
    "rgba(190,182,45)",
    "rgba(9,219,180)",
    "rgba(151,81,209)",
    "rgba(221,243,11)",
    "rgba(139,138,181)",
    "rgba(156,67,90)",
    "rgba(145,220,35)",
    "rgba(41,230,135)",
    "rgba(68,197,4)",
    "rgba(229,26,149)",
    "rgba(112,254,63)",
    "rgba(154,184,101)",
    "rgba(91,43,155)",
    "rgba(28,33,45)",
    "rgba(144,134,219)",
    "rgba(33,203,65)",
    "rgba(33,59,216)",
    "rgba(157,247,204)",
    "rgba(130,44,213)",
    "rgba(247,230,98)",
    "rgba(81,71,79)",
    "rgba(156,67,51)",
    "rgba(164,30,58)",
    "rgba(89,14,228)",
    "rgba(158,167,239)",
    "rgba(96,114,128)",
    "rgba(5,47,17)",
    "rgba(124,164,228)",
    "rgba(240,232,89)",
    "rgba(191,200,64)",
    "rgba(154,74,30)"
  ]

    return (
        <Bar data={{
            datasets: [{
                data: props.data,
                backgroundColor: graphColors,
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
