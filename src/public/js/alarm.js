
document.addEventListener('DOMContentLoaded', () => {
    const alarmButton = document.getElementById('set-alarm');

    alarmButton.addEventListener('click', () => {
        const time = document.getElementById('alarm-time').value;
        if (time) {
            fetch('/api/alarms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ time }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Alarm set:', data);
                })
                .catch(error => {
                    console.error('Error setting alarm:', error);
                });
        }
    });
});
