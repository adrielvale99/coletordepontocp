function updateTimes(source) {
    const entryInput = document.getElementById('entryTime');
    const lunchDurationSelect = document.getElementById('lunchDuration');
    const lunchStartInput = document.getElementById('lunchStart');
    const lunchReturnInput = document.getElementById('lunchReturn');

    const [entryH, entryM] = entryInput.value.split(':').map(Number);
    const entryTotalMin = entryH * 60 + entryM;
    const lunchDurationHours = parseFloat(lunchDurationSelect.value);
    const lunchDurationMin = lunchDurationHours * 60;

    if (source === 'entry' || source === 'duration' || !source) {
        // Reset lunch times based on defaults if entry or duration changes
        const lunchStartTotalMin = entryTotalMin + 4 * 60;
        lunchStartInput.value = formatTime(lunchStartTotalMin);

        const lunchReturnTotalMin = lunchStartTotalMin + lunchDurationMin;
        lunchReturnInput.value = formatTime(lunchReturnTotalMin);
    }

    // Always recalculate exit based on CURRENT values of lunch inputs
    const [lsH, lsM] = lunchStartInput.value.split(':').map(Number);
    const [lrH, lrM] = lunchReturnInput.value.split(':').map(Number);

    const actualLunchMin = (lrH * 60 + lrM) - (lsH * 60 + lsM);

    // Official Exit = Entry + 8h workday + actual lunch break
    const workdayMinutes = 8 * 60;
    const officialExitTotalMin = entryTotalMin + workdayMinutes + actualLunchMin;

    const officialExitStr = formatTime(officialExitTotalMin);
    document.getElementById('officialExit').textContent = officialExitStr;

    // Update tolerance fields
    document.getElementById('earlyExit').textContent = formatTime(officialExitTotalMin - 10);
    document.getElementById('lateExit').textContent = formatTime(officialExitTotalMin + 10);

    // Update subtext
    document.getElementById('lunchDurationText').textContent = formatLunchText(actualLunchMin / 60);
}

function formatTime(totalMinutes) {
    // Handle overflow/underflow if necessary, but for a daily tool simple is better
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = Math.floor(totalMinutes % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatLunchText(hours) {
    if (hours === 1) return "1h de almoço";
    if (hours === 1.25) return "1h 15m de almoço";
    if (hours === 1.5) return "1h 30m de almoço";
    if (hours === 2) return "2h de almoço";
    return `${hours}h de almoço`;
}

// Event Listeners
document.getElementById('entryTime').addEventListener('input', () => updateTimes('entry'));
document.getElementById('lunchDuration').addEventListener('change', () => updateTimes('duration'));
document.getElementById('lunchStart').addEventListener('input', () => updateTimes('lunch'));
document.getElementById('lunchReturn').addEventListener('input', () => updateTimes('lunch'));

// Initial call
updateTimes();
