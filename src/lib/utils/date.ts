export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 1).getDay();
}

export function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

export function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

export function formatDate(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    // Format: "Mon, Feb 27"
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDateISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function isBeforeDate(date: Date, minDateString?: string): boolean {
    if (!minDateString) return false;

    // Normalize checked date to midnight local
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    // Parse minDate string "YYYY-MM-DD" as local date
    const [y, m, day] = minDateString.split('-').map(Number);
    const min = new Date(y, m - 1, day);
    min.setHours(0, 0, 0, 0);

    return d < min;
}
