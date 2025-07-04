import "../../styles/components/Display.css";

// Shift time by -3h for PST toggle
function shiftTimeRange(timeRange, isPST) {
  if (!isPST) return timeRange;

  const [start, end] = timeRange.split(" - ");
  return `${shiftTime(start)} - ${shiftTime(end)}`;
}

function shiftTime(timeStr) {
  let match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);
  let hour, min, ampm;

  if (match) {
    hour = parseInt(match[1], 10);
    min = parseInt(match[2], 10);
    ampm = match[3];
  } else {
    // Try H(AM|PM)
    match = timeStr.match(/(\d+)(AM|PM)/i);
    if (!match) return timeStr; // fallback, invalid
    hour = parseInt(match[1], 10);
    min = 0;
    ampm = match[2];
  }

  // to 24h
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  // -3h
  hour -= 3;
  if (hour < 0) hour += 24;

  // back to 12h
  const newAMPM = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  const minStr = min === 0 ? "" : `:${min.toString().padStart(2, "0")}`;

  return `${hour}${minStr}${newAMPM}`;
}

// For calculating total hours
function calculateHours(timeRange) {
  const [start, end] = timeRange.split(" - ");
  const startDate = parseTime(start);
  const endDate = parseTime(end);

  let diff = (endDate - startDate) / (1000 * 60 * 60); // ms → hours

  if (diff < 0) diff += 24; // overnight fix (not needed here but safe)

  return diff;
}

function parseTime(timeStr) {
  const match = timeStr.match(/(\d+)(?::(\d+))?(AM|PM)/i);
  if (!match) return 0;

  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2] || "0", 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const d = new Date();
  d.setHours(hour);
  d.setMinutes(min);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
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

  const qaeTotals = {}; // name: { shifts, hours }

  schedule?.forEach((day) => {
    day.shifts.forEach((shift) => {
      const hours = calculateHours(shift.time);

      shift.assigned.forEach((name) => {
        if (!qaeTotals[name]) {
          qaeTotals[name] = { shifts: 0, hours: 0 };
        }
        qaeTotals[name].shifts += 1;
        qaeTotals[name].hours += hours;
      });
    });
  });

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
                <h3 style={{ fontSize: `25px`, textDecoration: `underline`, textAlign: `center`, marginBottom: `1.5rem` }}>{day.day}</h3>
                <table className="display-schedule-table">
                  <thead>
                    <tr>
                      <th style={{ fontSize: `20px` }}>Shift</th>
                      <th style={{ fontSize: `20px` }}>Time</th>
                      <th style={{ fontSize: `20px` }}>Assigned</th>
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
                  <th style={{ fontSize: `25px`, textDecoration: `underline` }}>Name</th>
                  <th style={{ fontSize: `25px`, textDecoration: `underline` }}>Total Shifts</th>
                  <th style={{ fontSize: `25px`, textDecoration: `underline` }}>Total Hours</th>
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
