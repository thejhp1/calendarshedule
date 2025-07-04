import { useState } from "react";
import "../../styles/components/Sidebar.css";
import { checkEnoughPeople } from "./scheduler";

export default function Sidebar({
  onGenerateSchedule,
  timeZoneToggle,
  toggleTimeZone,
}) {
  const [numShifts, setNumShifts] = useState(3);
  const [estNames, setEstNames] = useState("");
  const [pstNames, setPstNames] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const estPeople = estNames.split(",").map((n) => n.trim()).filter(Boolean);
    const pstPeople = pstNames.split(",").map((n) => n.trim()).filter(Boolean);

    if (estPeople.length === 0 || pstPeople.length === 0) {
      alert("Please enter at least one name for both EST and PST.");
      return;
    }

    if (!checkEnoughPeople(estPeople, pstPeople, Number(numShifts))) {
      alert(
        "Not enough people to cover all shifts without repeats. Please add more names."
      );
      return;
    }

    onGenerateSchedule({
      estPeople,
      pstPeople,
      numShifts: Number(numShifts),
    });
  };

  return (
    <section className="sidebar-container">
      <section className="sidebar-title">
        <h3>Enter The Things Here</h3>
      </section>

      <section className="sidebar-content">
        <form className="scheduler-form" onSubmit={handleSubmit}>
          <label>
            <h4>
              EST QAEs:
            </h4>
            <input
              type="text"
              value={estNames}
              onChange={(e) => setEstNames(e.target.value)}
            />
          </label>

          <label>
            <h4>
              PST QAEs:
            </h4>
            <input
              type="text"
              value={pstNames}
              onChange={(e) => setPstNames(e.target.value)}
            />
          </label>

          <label>
            <h4>
              Number of Shifts:
            </h4>
            <select
              value={numShifts}
              onChange={(e) => setNumShifts(Number(e.target.value))}
              style={{ width: `50px` }}
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </label>

          <button type="submit">Generate Schedule</button>
        </form>

        <section className="display-content-toggle-container">
          <p>Timezone Toggle: {timeZoneToggle}</p>
          <input
            type="checkbox"
            className="display-content-toggle"
            onClick={toggleTimeZone}
          />
        </section>
      </section>
    </section>
  );
}
