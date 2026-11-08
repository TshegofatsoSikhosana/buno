import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { db } from "@/config/database.config";
import { getItemsInOrder, graphColors, months } from "@/util/utils";
import { Line } from "react-chartjs-2";
import { InvestmentItem } from "@/model/models";
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function InvestmentAnalyticsTab() {
  const [monthsLabels, setMonthsLabels] = useState<string[]>([]);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [datasets, setDataSets] = useState<any[]>([]);
  const [investmentNames, setInvestmentNames] = useState<string[]>([]);
  const [filterType,setFilterType] = useState<string>();
  const [filteredInvestments, setFilteredInvestments] = useState<InvestmentItem[]>()
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [ytdTotal, setYtdTotal] = useState<number>(0);
  function getInvestments() {
    db.investments.toArray().then((ex) => {
      const monthSet = new Set<string>();
      const items = getItemsInOrder(ex);
      setFilteredInvestments(items);
      const itemLabels = new Set<string>();

      let filteredInvestments: InvestmentItem[] = [];

      items.forEach((e) => {
        monthSet.add(months[Number(e.month) - 1] + " " + e.year);
        itemLabels.add(e.description);
        e.actualAmount = Number(e.actualAmount);
      });
      populateInvestmentNames(itemLabels);
      filteredInvestments = items;
      const monthL = Array.from(monthSet);
      setMonthsLabels(monthL);
      setInvestments(filteredInvestments);
    });
  }

  useEffect(() => {
    getInvestments();
  }, []);

  useEffect(()=>{
        if(filterType){
          setFilteredInvestments(investments.filter((e)=> e.description.trim() === filterType));
        }else{
          
          setFilteredInvestments(investments)
        }
  },[filterType,investments]);

  function getFilteredInvestments(){
    if(filteredInvestments){
      let filtered: InvestmentItem[] = [];
      
      if(filterType){
        filtered = filteredInvestments.filter((e)=> e.description.trim() === filterType);
      }else{
        filtered = filteredInvestments;
      }

      const totals: number[] = [];
      const data: any[]= [];
      monthsLabels.forEach((month, index) => {
         const items = filtered.filter((e) => months[Number(e.month)-1] + " " + e.year === month);
         const total = items.map((e)=> Number(e.actualAmount)).reduce((p,c)=> Number(p)+Number(c),0);
        totals.push(total);
        const color =  graphColors[index+1];

        const ep = {
          data: [...totals],
          borderColor: color,
          label: month,
        };
        data.push(ep);
      })
      const grandTotal = totals.reduce((p,c)=> Number(p)+Number(c),0);
      setGrandTotal(grandTotal);
      setDataSets([...totals]);

      let ytdTotal = 0;
      monthsLabels.filter((m)=> m.includes(new Date().getFullYear().toString())).forEach((month, index) => {
         const items = filtered.filter((e) => months[Number(e.month)-1] + " " + e.year === month);
         const total = items.map((e)=> Number(e.actualAmount)).reduce((p,c)=> Number(p)+Number(c),0);
        ytdTotal = ytdTotal + total;
      })
      setYtdTotal(ytdTotal);
    }
   
  }


  useEffect(()=>{
        if(filteredInvestments && monthsLabels && monthsLabels.length > 0){
          getFilteredInvestments();
        }
  },[filteredInvestments, monthsLabels]);
  

  function populateInvestmentNames(names: Set<string>){
      let itemsSet = new Set<string>();
      if(investmentNames){
          itemsSet = new Set(investmentNames);
      }
      setInvestmentNames(Array.from(names));
  }

  return (
    <>
    <div>
    <div className="inline-block  w-11/12 p-2">

       <div className='inline-block mr-5 w-2/12' style={{border:'2px solid rgba(222,222,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <h1>Total Contributions:</h1>
            <div>R{grandTotal}</div>
       </div>
       <div className='inline-block mr-5 w-2/12' style={{border:'2px solid rgba(222,222,222,0.5)', padding:'1rem',borderRadius:'10px' }}>
            <h1>YTD Contributions:</h1>
            <div>R{ytdTotal}</div>
       </div>
    </div>
    <div className="inline  w-4/12 p-2">
                  {/* <button
                    className="p-2 mb-2 mr-2 btn-add"
                    onClick={(e)=> setIsTotalsView(!isTotalsView)}>
                      {isTotalsView ? "Show Current Budget" : "Show Totals"}
                </button> */}

                <select className="text-white p-2"
                        style={{borderRadius: '5px', backgroundColor: 'rgb(70, 70, 80,180)'}}
                        value={filterType}
                        onChange={(e)=> setFilterType(e.target.value.trim())}>
                    <option value={''}>All {investmentNames.length || 0} Items</option>
                    {investmentNames?.map((name, i)=>{
                        return <><option value={name} key={i}>{name}</option></>
                    })}
                </select>
    </div>
    <div className="inline w-3/12 p-2"></div>
    </div>
    <div className="w-10/12 inline-block mt-5">
              <div className='w-100'>

      <div className="text-white inline-block" style={{ width: "80%" }}>
        {datasets.length && monthsLabels && (
          <Line
            data={{
              labels: monthsLabels,
              datasets: [{
                data: [...datasets],
                borderColor: '#24a6f1ff',
                label: 'Investements'
              }]
            }}
            options={{
              layout: { padding: 2 },
              color: "white",
              scales: {},
              elements: {
                bar: {
                  borderWidth: 2,
                },
              },
              responsive: true,
              plugins: {
                legend: {
                  position: "right" as const,
                  display: true,
                  labels: {
                    color: "white",
                  },
                },
                title: {
                  display: true,
                  text: "Past Budget Totals By Category Overview",
                  color: "white",
                },
              },
            }}
            style={{ color: "white", width: "100%" }}
          />
        )}
      </div>
      </div>
    </div>
    </>
  );
}

export default InvestmentAnalyticsTab;
