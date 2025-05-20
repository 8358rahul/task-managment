import * as Localization from 'expo-localization';

export const formatTimeForAPI = (value: any, format = 'YYYY-MM-DD hh:mm a') => {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return null;
    }

    const locale = Localization.locale;
    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes('YYYY-MM-DD')) {
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
    }

    if (format.includes('HH:mm')) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hourCycle = 'h23'; // 24-hour
    } else if (format.includes('hh:mm a')) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true; // 12-hour with AM/PM
    }

    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

    // For format like 'YYYY-MM-DD hh:mm a'
    if (format === 'YYYY-MM-DD hh:mm a') {
      const parts = formattedDate.split(', ');
      const datePart = parts[0];
      const timePart = parts[1] || '';
      return `${datePart.split('/').reverse().join('-')} ${timePart}`;
    }

    // Default fallback
    return formattedDate || "";
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};
