import { isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const calculateSummaries = (expenses) => {
  let today = 0, week = 0, month = 0, year = 0;

  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const amount = exp.amount;

    if (isToday(date)) today += amount;
    if (isThisWeek(date)) week += amount;
    if (isThisMonth(date)) month += amount;
    if (isThisYear(date)) year += amount;
  });

  return { today, week, month, year, totalCount: expenses.length };
};
