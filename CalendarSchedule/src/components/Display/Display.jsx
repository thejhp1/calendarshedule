import "../../styles/components/Display.css";

// 👉 helper to shift time ranges if PST toggle is active
function shiftTimeRange(timeRange, isPST) {
  if (!isPST) return timeRange;

  const [start, end] = timeRange.split(" - ");
  return `${shiftTime(start)} - ${shiftTime(end)}`;
}

function shiftTime(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);
  if (!match) return timeStr;

  let [_, hourStr, minStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  // Convert to 24h
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  // Shift by -3h
  hour -= 3;
  if (hour < 0) hour += 24;

  // Back to 12h
  const newAMPM = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minStr}${newAMPM}`;
}

export default function Display({ schedule, warningMessage, timeZoneToggle }) {
  const isPST = timeZoneToggle === "PST";

  if (warningMessage) {
    return (
      <section className="display-container">
        <section className="display-title">
          <p>See The Thing Here</p>
        </section>
        <section className="display-content">
          <div className="warning-message">{warningMessage}</div>
        </section>
      </section>
    );
  }

  return (
    <section className="display-container">
      <section className="display-title">
        <p>See The Things Here ({timeZoneToggle})</p>
      </section>
      <section className="display-content-shedule">
        {schedule && schedule.length > 0 ? (
          schedule.map((day) => (
            <div className="display-schedule-container" key={day.day}>
              <h3>{day.day}</h3>
              <table className="display-schedule-table">
                <thead>
                  <tr>
                    <th>Shift</th>
                    <th>Time</th>
                    <th>Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {day.shifts.map((shift) => (
                    <tr key={shift.shiftNum}>
                      <td>{shift.shiftNum}</td>
                      <td>{shiftTimeRange(shift.time, isPST)}</td>
                      <td>{shift.assigned.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No schedule yet.</p>
        )}
      </section>
    </section>
  );
}
