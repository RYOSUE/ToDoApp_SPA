export default function toJSTISOString(date: Date): string {
    const jstDate = new Date(date.getTime() + 3600000 * 9);
    return jstDate.toISOString().slice(0, 10);
}