import { useEffect, useState } from "react";
import "./App.css";

interface CalendarItem {
  date: string;
  type: "working" | "holiday" | "weekend";
  holidayName: string | null;
}

const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function App() {
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1));

  useEffect(() => {
    const getResult = async () => {
      try {
        const res = await fetch("/calendar.json");
        if (!res.ok) throw new Error("Failed to fetch calendar data");
        const data = await res.json();
        setCalendarData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    getResult();
  }, []);

  // Calculate leading empty offset cells for alignment
  const firstDateString = calendarData[0]?.date;


  const parsingdays = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
).getDay();

  const handlePrevious = () => {
  setCurrentDate((prev) => 
    new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
  );
};

const handleNext = () => {
  setCurrentDate((prev) => 
    new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
  );
};

  return (
     <div>
        <div className="grid grid-cols-7 gap-3">
          {WEEK_DAYS.map((item)=>(
            <p>{item}</p>
          ))}
        </div>
         <div className="grid grid-cols-7 gap-3">
           {Array.from({length: parsingdays}).map((_,index)=>(
            <div key={index} className="h-28 border-none"></div>
           ))}
           {calendarData.map((item)=> {
            const day = parseInt(item.date.split("-")[2],10)
            return(
              <div className="border border-black h-28">
                <div>{day}</div>
              </div>
            )
           })}
        </div>
        <button onClick={handlePrevious}>
    Previous
  </button>

  <h2>
    {currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}
  </h2>

  <button onClick={handleNext}>
    Next
  </button>
     </div>
  );
}

export default App;