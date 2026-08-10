import { isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const calculateSummaries = (expenses) => {
  let today = 0, week = 0, month = 0, year = 0;

  const onlyExpenses = expenses.filter(e => !e.type || e.type === 'expense');

  onlyExpenses.forEach(exp => {
    const date = new Date(exp.date);
    const amount = exp.amount;

    if (isToday(date)) today += amount;
    if (isThisWeek(date, { weekStartsOn: 1 })) week += amount;
    if (isThisMonth(date)) month += amount;
    if (isThisYear(date)) year += amount;
  });

  return { today, week, month, year, totalCount: onlyExpenses.length };
};
