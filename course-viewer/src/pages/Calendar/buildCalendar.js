export default function buildCalendar(value) {
    const startDay = value.clone().startOf('month').startOf('week'); // gives us the starting day of the month
    const endDay = value.clone().endOf('month').endOf('week'); // gives us the ending day of the month
    const calendar = []
    const day = startDay.clone().subtract(1, 'day'); // iterator
    
    // iterate through so long as day is before the end day
    while (day.isBefore(endDay, 'day')) {
        calendar.push(
        // for each of the weeks we will push a size 7 array inside
        Array(7)
          .fill(0)
          .map(() => day.add(1, 'day').clone())
      );
    }
    return calendar;
}