// scheduler.js

/**
 * Generates the daily schedule for one day.
 * Ensures each person only works ONE shift per day.
 * Throws an error if there are not enough unique people.
 */
export function generateDailySchedule({ estCount, pstCount, numShifts }) {
  const shiftBlocks = {
    3: [
      { start: "9:00AM", end: "12:30PM" },
      { start: "12:30PM", end: "4:00PM" },
      { start: "4:00PM", end: "8:00PM" },
    ],
    4: [
      { start: "9:00AM", end: "12:00PM" },
      { start: "12:00PM", end: "2:30PM" },
      { start: "2:30PM", end: "5:00PM" },
      { start: "5:00PM", end: "8:00PM" },
    ],
  }[numShifts];

  if (!shiftBlocks) {
    throw new Error(`Unsupported number of shifts: ${numShifts}`);
  }

  const estPeople = Array.from({ length: estCount }, (_, i) => `EST_${i + 1}`);
  const pstPeople = Array.from({ length: pstCount }, (_, i) => `PST_${i + 1}`);

  if (estPeople.length === 0) throw new Error("You must have at least 1 EST person.");
  if (pstPeople.length === 0) throw new Error("You must have at least 1 PST person.");

  const assignedPeople = new Set();
  const shifts = [];

  for (let i = 0; i < shiftBlocks.length; i++) {
    let available;

    if (i === 0) {
      // First shift: EST only
      available = estPeople.filter((p) => !assignedPeople.has(p));
    } else if (i === shiftBlocks.length - 1) {
      // Last shift: PST only
      available = pstPeople.filter((p) => !assignedPeople.has(p));
    } else {
      // Middle shifts: EST or PST, but reserve PST people for last shift
      // Calculate how many PST people remain unassigned:
      const pstAssignedCount = Array.from(assignedPeople).filter((p) => p.startsWith("PST_")).length;
      const pstRemaining = pstPeople.length - pstAssignedCount;

      // If only one PST person remains and last shift not assigned, do not assign PST in middle shift
      if (pstRemaining <= 1) {
        available = estPeople.filter((p) => !assignedPeople.has(p));
      } else {
        available = [...estPeople, ...pstPeople].filter((p) => !assignedPeople.has(p));
      }
    }

    console.log(`Shift ${i + 1} available people:`, available);

    if (available.length === 0) {
      throw new Error(
        `Not enough unique people left for shift ${i + 1}. Try adding more people!`
      );
    }

    const person = available[Math.floor(Math.random() * available.length)];
    assignedPeople.add(person);

    shifts.push({
      shiftNum: i + 1,
      time: `${shiftBlocks[i].start} - ${shiftBlocks[i].end}`,
      assigned: [person],
    });
  }

  return shifts;
}

/**
 * Generates a full Monday–Friday schedule.
 * Each day is independent but all use the same input constraints.
 */
export function generateWeeklySchedule(inputs) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return days.map((day) => ({
    day,
    shifts: generateDailySchedule(inputs),
  }));
}

/**
 * Checks if you have enough unique people to cover the shifts
 * without forcing double-ups.
 *
 * @returns {boolean} true = enough, false = not enough
 */
export function checkEnoughPeople(estCount, pstCount, numShifts) {
  if (estCount < 1 || pstCount < 1) return false;

  const estOnlyShifts = 1; // first shift
  const pstOnlyShifts = 1; // last shift
  const middleShifts = numShifts - 2;

  // Split middle shifts roughly evenly between EST and PST
  const estMiddleNeeded = Math.ceil(middleShifts / 2);
  const pstMiddleNeeded = Math.floor(middleShifts / 2);

  const estNeeded = estOnlyShifts + estMiddleNeeded;
  const pstNeeded = pstOnlyShifts + pstMiddleNeeded;

  return estCount >= estNeeded && pstCount >= pstNeeded;
}
