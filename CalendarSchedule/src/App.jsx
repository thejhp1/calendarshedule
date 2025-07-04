import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Display from "./components/Display/Display";
import {
  generateWeeklySchedule,
  checkEnoughPeople,
} from "./components/Sidebar/scheduler";

function App() {
  const [schedule, setSchedule] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [timeZoneToggle, setTimeZoneToggle] = useState("EST");
  const [flag, setFlag] = useState(true);

  const handleGenerate = ({ estCount, pstCount, numShifts }) => {
    if (!checkEnoughPeople(estCount, pstCount, numShifts)) {
      setWarningMessage(
        "Not enough people to cover all shifts without repeats. Please add more EST or PST people."
      );
      setSchedule(null);
      return;
    }

    setWarningMessage("");
    const newSchedule = generateWeeklySchedule({
      estCount,
      pstCount,
      numShifts,
    });
    setSchedule(newSchedule);
  };

  const toggleTimeZone = () => {
    if (flag) {
      setTimeZoneToggle("PST");
      setFlag(false)
    } else {
      setTimeZoneToggle("EST");
      setFlag(true)
    }
  };

  return (
    <main className="app-container">
      <Display schedule={schedule} warningMessage={warningMessage} timeZoneToggle={timeZoneToggle}/>
      <Sidebar
        onGenerateSchedule={handleGenerate}
        warningMessage={warningMessage}
        timeZoneToggle={timeZoneToggle}
        toggleTimeZone={toggleTimeZone}
      />
    </main>
  );
}

export default App;
