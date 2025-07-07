// utils/googleCalendar.js
export default async function sendEventsToGoogle(schedule, emails) {
  // 👇 Replace with your real OAuth token!
  const accessToken = window.gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getAuthResponse().access_token;

  const calendarId = "primary"; // Or your team calendar ID

  for (const day of schedule) {
    for (const shift of day.shifts) {
      const summary = `[Triage] Shift ${shift.shiftNum}`;
      const [start, end] = shift.time.split(" - ");
      const startDateTime = convertToISO(start, day.day);
      const endDateTime = convertToISO(end, day.day);

      const assignedEmails = shift.assigned.map(name => emails[name] || "");

      const event = {
        summary,
        start: { dateTime: startDateTime, timeZone: "America/New_York" },
        end: { dateTime: endDateTime, timeZone: "America/New_York" },
        attendees: assignedEmails.map(email => ({ email })),
      };

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!res.ok) {
        console.error(await res.text());
      }
    }
  }
}

// A real version should parse actual date + time properly.
function convertToISO(time, day) {
  // For example, hardcode Monday => 2025-07-07
  const date = "2025-07-07";
  return `${date}T${formatTime24(time)}`;
}

function formatTime24(time) {
  // e.g. "9:00AM" => "09:00:00"
  let [_, hr, min, ampm] = time.match(/(\d+):(\d+)(AM|PM)/i);
  hr = parseInt(hr, 10);
  if (ampm === "PM" && hr !== 12) hr += 12;
  if (ampm === "AM" && hr === 12) hr = 0;
  return `${hr.toString().padStart(2, "0")}:${min}:00`;
}
