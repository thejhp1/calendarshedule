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

  return (
    <main className="app-container">
      <Display schedule={schedule} warningMessage={warningMessage} />
      <Sidebar
        onGenerateSchedule={handleGenerate}
        warningMessage={warningMessage}
      />
    </main>
  );
}

export default App;
