// scheduler.js

export function generateDailySchedule({ estPeople, pstPeople, numShifts }, globalShiftCount) {
  const shiftBlocks = {
    3: [
      { start: "9AM", end: "12:30PM" },
      { start: "12:30PM", end: "4PM" },
      { start: "4PM", end: "8PM" },
    ],
    4: [
      { start: "9AM", end: "12PM" },
      { start: "12PM", end: "2:30PM" },
      { start: "2:30PM", end: "5PM" },
      { start: "5PM", end: "8PM" },
    ],
  }[numShifts];

  if (!shiftBlocks) {
    throw new Error(`Unsupported number of shifts: ${numShifts}`);
  }

  if (estPeople.length === 0)
    throw new Error("You must have at least 1 EST person.");
  if (pstPeople.length === 0)
    throw new Error("You must have at least 1 PST person.");

  const assignedToday = new Set();
  const shifts = [];

  for (let i = 0; i < shiftBlocks.length; i++) {
    let eligible;

    if (i === 0) {
      eligible = estPeople.filter(p => !assignedToday.has(p));
    } else if (i === shiftBlocks.length - 1) {
      eligible = pstPeople.filter(p => !assignedToday.has(p));
    } else {
      const pstAssignedToday = Array.from(assignedToday).filter(p =>
        pstPeople.includes(p)
      ).length;
      const pstRemaining = pstPeople.length - pstAssignedToday;

      if (pstRemaining <= 1) {
        eligible = estPeople.filter(p => !assignedToday.has(p));
      } else {
        eligible = [...estPeople, ...pstPeople].filter(
          p => !assignedToday.has(p)
        );
      }
    }

    if (eligible.length === 0) {
      throw new Error(
        `Not enough unique people left for shift ${
          i + 1
        }. Try adding more people!`
      );
    }

    let minShifts = Infinity;
    eligible.forEach(name => {
      const count = globalShiftCount[name] || 0;
      if (count < minShifts) minShifts = count;
    });

    const leastUsed = eligible.filter(
      name => (globalShiftCount[name] || 0) === minShifts
    );

    const person = leastUsed[Math.floor(Math.random() * leastUsed.length)];
    assignedToday.add(person);

    globalShiftCount[person] = (globalShiftCount[person] || 0) + 1;

    shifts.push({
      shiftNum: i + 1,
      time: `${shiftBlocks[i].start} - ${shiftBlocks[i].end}`,
      assigned: [person],
    });
  }

  return shifts;
}

export function generateWeeklySchedule({ estPeople, pstPeople, numShifts }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const globalShiftCount = {};

  return days.map(day => ({
    day,
    shifts: generateDailySchedule({ estPeople, pstPeople, numShifts }, globalShiftCount),
  }));
}

export function checkEnoughPeople(estPeople, pstPeople, numShifts) {
  if (estPeople.length < 1 || pstPeople.length < 1) return false;

  const estOnlyShifts = 1;
  const pstOnlyShifts = 1;
  const middleShifts = numShifts - 2;

  const estMiddleNeeded = Math.ceil(middleShifts / 2);
  const pstMiddleNeeded = Math.floor(middleShifts / 2);

  const estNeeded = estOnlyShifts + estMiddleNeeded;
  const pstNeeded = pstOnlyShifts + pstMiddleNeeded;

  return estPeople.length >= estNeeded && pstPeople.length >= pstNeeded;
}
