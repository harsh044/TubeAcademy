export default function convertToHoursMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60); // Get the integer part as hours
    const minutes = Math.round(totalMinutes % 60); // Get the remaining minutes

    return `${hours} hour(s) ${minutes} minute(s)`;
    };