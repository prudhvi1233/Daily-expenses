import { parse, format } from 'date-fns';

export const formatTime12Hour = (timeString) => {
  if (!timeString) return '';
  try {
    const parsedTime = parse(timeString, 'HH:mm', new Date());
    return format(parsedTime, 'h:mm a');
  } catch (e) {
    return timeString; // fallback
  }
};
