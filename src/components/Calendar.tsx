import { useState } from 'react';

const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month:number, year:number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonthClick = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonthClick = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const renderDays = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const prevMonthDays = getDaysInMonth(month - 1, year);
    const nextMonthDays = 7 - lastDay.getDay() - 1;

    const days = [];

    for (let i = 0; i < 42 && i < firstDay.getDay() + lastDay.getDate(); i++) {
      const dayNumber = i >= firstDay.getDay() && i < firstDay.getDay() + lastDay.getDate() ? i - firstDay.getDay() + 1 : null;

      days.push(
        <span key={i} className={dayNumber ? '' : 'disabled'}>
          {dayNumber || (i < firstDay.getDay() ? prevMonthDays - firstDay.getDay() + i + 1 : Number(dayNumber) + nextMonthDays)}
        </span>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <span className="prev-month" onClick={handlePrevMonthClick}>
          &lt;
        </span>
        <span className="month-year">
          {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <span className="next-month" onClick={handleNextMonthClick}>
          &gt;
        </span>
      </div>
      <div className="calendar-body">
        <div
 
className="weekdays">

          
<span>Mon</span>

          
<span>Tue</span>

          
<span>Wed</span>

          
<span>Thu</span>

          
<span>Fri</span>

          
<span>Sat</span>

          
<span>Sun</span>

        
</div>

        
<div
 
className="days">{renderDays()}</div>
      </div>
    </div>
  );
};

export default Calendar;