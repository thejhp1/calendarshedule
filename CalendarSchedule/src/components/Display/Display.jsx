import "../../styles/components/Display.css";

// Shift time by -3h for PST toggle
function shiftTimeRange(timeRange, isPST) {
  if (!isPST) return timeRange;

  const [start, end] = timeRange.split(" - ");
  return `${shiftTime(start)} - ${shiftTime(end)}`;
}

function shiftTime(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);
  if (!match) return timeStr;

  let [, hourStr, minStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  hour -= 3;
  if (hour < 0) hour += 24;

  const newAMPM = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minStr}${newAMPM}`;
}

// For calculating total hours
function calculateHours(timeRange) {
  const [start, end] = timeRange.split(" - ");
  return (parseTime(end) - parseTime(start) + 24) % 24;
}

function parseTime(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);
  if (!match) return 0;

  let [, hourStr, minStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10) / 60;

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return hour + min;
}

export default function Display({ schedule, warningMessage, timeZoneToggle }) {
  const isPST = timeZoneToggle === "PST";

  // Totals
  const totals = {};
  if (schedule && schedule.length > 0) {
    schedule.forEach((day) => {
      day.shifts.forEach((shift) => {
        shift.assigned.forEach((name) => {
          if (!totals[name]) {
            totals[name] = { shifts: 0, hours: 0 };
          }
          totals[name].shifts += 1;

          const timeRange = shiftTimeRange(shift.time, isPST);
          totals[name].hours += calculateHours(timeRange);
        });
      });
    });
  }

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
    <section>
      <section className="display-schedule-container">
        <section className="display-title">
          <h3>See The Things Here ({timeZoneToggle})</h3>
        </section>
        <section className="display-content-shedule">
          {schedule && schedule.length > 0 ? (
            schedule.map((day) => (
              <div className="display-schedule-table-container" key={day.day}>
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
            <div className="display-empty">
              Please enter a schedule.
            </div>
          )}
        </section>
      </section>

      <section className="display-time-tracking-container">
        <section className="display-time-tracking">
          {Object.entries(totals).length > 0 ? (
            <table className="display-totals-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Shifts</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totals).map(([name, info]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{info.shifts}</td>
                    <td>{info.hours.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="display-empty">
              No time tracking yet.
            </div>
          )}
        </section>
      </section>
    </section>
  );
}
