import moment from "moment";

type DateRange = [string, string, string];

function optimizeFunc(
  startDate: string,
  endDate: string,
  periodHours: number,
  dateRanges: DateRange[]
): { start: string; end: string }[] {
  const availableBlocks: { start: string; end: string }[] = [];
  const start = moment(startDate);
  const end = moment(endDate);
  const period = moment.duration(periodHours, "hours");

  // Convert blocked date ranges to moment objects for easier comparison
  const blockedRanges = dateRanges.map(([date, startTime, endTime]) => ({
    date,
    start: moment(`${date} ${startTime}`),
    end: moment(`${date} ${endTime}`),
  }));

  // Iterate through each day in the date range
  for (let m = start.clone(); m.isBefore(end); m.add(1, "days")) {
    const dayStart = m.clone().startOf("day");
    const dayEnd = m.clone().endOf("day");

    // Iterate through the entire day by one-hour increments for the given period
    for (
      let blockStart = dayStart.clone();
      blockStart.isBefore(dayEnd);
      blockStart.add(1, "hours")
    ) {
      const blockEnd = blockStart.clone().add(period);

      // Check if the block is within the main date range
      if (blockEnd.isAfter(end)) break;

      // Check if the block overlaps with any of the blocked ranges
      const isBlocked = blockedRanges.some((range) => {
        return range.start.isBefore(blockEnd) && range.end.isAfter(blockStart);
      });

      if (!isBlocked) {
        availableBlocks.push({
          start: blockStart.format("YYYY-MM-DD HH:mm:ss"),
          end: blockEnd.format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    }
  }

  return availableBlocks;
}

// Example usage
const startDate = "2024-06-10";
const endDate = "2024-06-16";
const periodHours = 5;
const blockedRanges: DateRange[] = [
  ["2024-06-10", "08:00:00", "16:30:00"],
  ["2024-06-11", "08:00:00", "17:30:00"],
  ["2024-06-12", "08:00:00", "16:30:00"],
  ["2024-06-13", "08:00:00", "16:30:00"],
  ["2024-06-14", "08:00:00", "16:30:00"],
  ["2024-06-11", "09:00:00", "16:30:00"],
  ["2024-06-14", "18:00:00", "19:30:00"],
  ["2024-06-15", "08:00:00", "16:30:00"],
  ["2024-06-14", "20:00:00", "22:30:00"],
  ["2024-06-16", "08:00:00", "10:30:00"],
];
const blockedTimes = [
  "23:00:00",
  "00:00:00",
  "01:00:00",
  "02:00:00",
  "03:00:00",
  "04:00:00",
  "05:00:00",
  "06:00:00",
  "07:00:00",
];

const availableBlocks = optimizeFunc(
  startDate,
  endDate,
  periodHours,
  blockedRanges
);

const finalAnswers: { start: string; end: string }[] = [];

// Filter and add the results to the finalAnswers array
availableBlocks.forEach((block) => {
  const blockStart = block.start.split(" ")[1];
  const blockEnd = block.end.split(" ")[1];

  if (blockedTimes.includes(blockStart) || blockedTimes.includes(blockEnd)) {
    return;
  }

  finalAnswers.push(block);
});
