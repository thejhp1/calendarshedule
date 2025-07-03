import "../../styles/components/Display.css";

export default function Display({ schedule, warningMessage }) {
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
        <p>See The Things Here</p>
      </section>
      <section className="display-content">
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
                      <td>{shift.time}</td>
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
