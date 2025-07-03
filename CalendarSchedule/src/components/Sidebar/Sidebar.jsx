import "../../styles/components/Sidebar.css";
import { useState } from "react";

export default function Sidebar({ onGenerateSchedule }) {
  const [estCount, setEstCount] = useState(2);
  const [pstCount, setPstCount] = useState(2);
  const [numShifts, setNumShifts] = useState(4);
  const [warningMessage, setWarningMessage] = useState("");

  // on submit:
  const handleSubmit = (e) => {
    e.preventDefault();

    const est = parseInt(estCount, 10);
    const pst = parseInt(pstCount, 10);
    const shifts = parseInt(numShifts, 10);

    onGenerateSchedule({ estCount: est, pstCount: pst, numShifts: shifts });
  };

  return (
    <>
      <section className="sidebar-container">
        <section className="sidebar-title">
          <p>Enter The Things Here</p>
        </section>
        <section className="sidebar-content">
          <form className="scheduler-form" onSubmit={handleSubmit}>
            <label>
              EST People:
              <input
                type="number"
                min="0"
                value={estCount}
                onChange={(e) => setEstCount(e.target.value)}
              />
            </label>
            <label>
              PST People:
              <input
                type="number"
                min="0"
                value={pstCount}
                onChange={(e) => setPstCount(e.target.value)}
              />
            </label>
            <label>
              Number of Shifts:
              <select
                value={numShifts}
                onChange={(e) => setNumShifts(e.target.value)}
              >
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            {/* <label>
              Allow Double Up:
              <input
                type="checkbox"
                checked={allowDoubleUp}
                onChange={(e) => setAllowDoubleUp(e.target.checked)}
              />
            </label> */}
            <button type="submit" >Generate Schedule</button>
          </form>

          {/* ✅ Show warning message if exists */}
          {warningMessage && (
            <div className="warning-message">{warningMessage}</div>
          )}
        </section>
      </section>
    </>
  );
}
