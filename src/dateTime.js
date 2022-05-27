//import { parseISO, compareAsc, startOfToday, format, addDays, getTime } from 'date-fns';
import { parseISO, compareAsc, startOfToday, addDays, format, getTime } from 'date-fns';


const dateTime = (() => {

    const todayDate = () => {
        return startOfToday();
    };

    const nextWeekDate = (date) => {
        return addDays(date, 7)
    };

    const parseDate = (date) => {
        return parseISO(date);
    };

    const compareDate = (date1, date2) => {
        return compareAsc(date1, date2);
    };

    const formateDate = (date) => {
        return format(date, "yyyy-MM-dd");
    };

    const getTimestamp = () => {
        return getTime(new Date());
    };

    const isDateInPast = (date) => {
        const isoDate = dateTime.parseDate(date);
        const result = compareDate(isoDate, todayDate());
        let isInPast = false;
        if (result === -1) isInPast = true;
        return isInPast;
    };

    return { todayDate, nextWeekDate, parseDate, compareDate, formateDate, getTimestamp, isDateInPast }
})();

export { dateTime };