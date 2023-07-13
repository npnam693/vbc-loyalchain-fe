import React from "react";
import "./StatisticItem.scss";
import CountUp from 'react-countup';
import { Statistic } from "antd";


const formatter = (value : any) => <CountUp start={value*0.7} end={value} separator="," duration={1}/>;

interface IStatisticItem {
  title: string;
  note: string;
  value: number;
}

const StatisticItem = (props: IStatisticItem) => { 
  return (
    <div className="app-statistic">
      <p className='title'>
        {props.title}
        {
          props.note && <span> ({props.note})</span>          
        }
      </p>
      <Statistic value={props.value} formatter={formatter} 
        style={{fontSize: 20}}
      />
    </div>
  );
};

export default StatisticItem;
