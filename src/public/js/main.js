document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Helper function to safely get elements
    function $(id) {
        return document.getElementById(id);
    }

    // Device status
    const deviceStatus = $('device-status');

    // Messages
    const messageList = $('messages');
    const userInput = $('user-input');
    const sendMessage = $('send-message');

    // Alarms
    const alarmList = $('alarm-list');
    const addAlarmForm = $('add-alarm-form');

    // Quotes
    const quoteList = $('quote-list');
    const addQuoteForm = $('add-quote-form');

    // Todos
    const todoList = $('todo-list');
    const newTodo = $('new-todo');
    const addTodo = $('add-todo');

    // Music
    const playMusicForm = $('play-music-form');
    const pauseButton = $('pause-button');
    const resumeButton = $('resume-button');
    const stopButton = $('stop-button');
    const nextButton = $('next-button');
    const previousButton = $('previous-button');

    // Radio
    const playRadio = $('play-radio');
    const stopRadio = $('stop-radio');

    // Logs
    const logEntries = $('log-entries');
    const toggleLogs = $('toggle-logs');

    // Check if elements exist before adding event listeners
    if (toggleLogs) {
        toggleLogs.addEventListener('click', () => {
            logEntries.classList.toggle('hidden');
        });
    }

    if (sendMessage) {
        sendMessage.addEventListener('click', () => {
            const message = userInput.value.trim();
            if (message) {
                socket.emit('message', { type: 'message', data: message });
                userInput.value = '';
            }
        });
    }

    if (addAlarmForm) {
        addAlarmForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const time = $('alarm-time').value;
            const message = $('alarm-message').value.trim();
            if (time && message) {
                socket.emit('message', { type: 'add_alarm', data: { time, message } });
                addAlarmForm.reset();
            }
        });
    }

    if (addQuoteForm) {
        addQuoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = $('quote-text').value.trim();
            const author = $('quote-author').value.trim();
            if (text && author) {
                socket.emit('message', { type: 'add_quote', data: { text, author } });
                addQuoteForm.reset();
            }
        });
    }

    if (addTodo) {
        addTodo.addEventListener('click', () => {
            const todo = newTodo.value.trim();
            if (todo) {
                socket.emit('message', { type: 'add_todo', data: todo });
                newTodo.value = '';
            }
        });
    }

    if (playMusicForm) {
        playMusicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const uri = $('music-uri').value.trim();
            if (uri) {
                socket.emit('message', { type: 'play_music', data: uri });
                playMusicForm.reset();
            }
        });
    }

    if (pauseButton) {
        pauseButton.addEventListener('click', () => socket.emit('message', { type: 'pause_music' }));
    }

    if (resumeButton) {
        resumeButton.addEventListener('click', () => socket.emit('message', { type: 'resume_music' }));
    }

    if (stopButton) {
        stopButton.addEventListener('click', () => socket.emit('message', { type: 'stop_music' }));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => socket.emit('message', { type: 'next_track' }));
    }

    if (previousButton) {
        previousButton.addEventListener('click', () => socket.emit('message', { type: 'previous_track' }));
    }

    if (playRadio) {
        playRadio.addEventListener('click', () => socket.emit('message', { type: 'play_radio' }));
    }

    if (stopRadio) {
        stopRadio.addEventListener('click', () => socket.emit('message', { type: 'stop_radio' }));
    }

    // Handle Socket.IO messages
    socket.on('message', (data) => {
        switch (data.type) {
            case 'status':
                deviceStatus.textContent = `Device Status: ${data.data}`;
                break;
            case 'message':
                const messageElement = document.createElement('div');
                messageElement.textContent = data.data;
                messageList.appendChild(messageElement);
                break;
            case 'alarm':
                const alarmItem = document.createElement('li');
                alarmItem.textContent = `${data.time}: ${data.message}`;
                alarmList.appendChild(alarmItem);
                break;
            case 'quote':
                const quoteItem = document.createElement('li');
                quoteItem.textContent = `"${data.text}" - ${data.author}`;
                quoteList.appendChild(quoteItem);
                break;
            case 'todo':
                const todoItem = document.createElement('li');
                todoItem.textContent = data.data;
                todoList.appendChild(todoItem);
                break;
            case 'log':
                const logEntry = document.createElement('div');
                logEntry.textContent = data.data;
                logEntries.appendChild(logEntry);
                break;
        }
    });

    // Handle wake word detection
    socket.on('wakeWordDetected', (data) => {
        const wakeWordMessage = document.createElement('div');
        wakeWordMessage.classList.add('system-message');
        wakeWordMessage.textContent = data.message;
        messageList.appendChild(wakeWordMessage);
        messageList.scrollTop = messageList.scrollHeight;
    });

    // Handle transcription result
    socket.on('transcriptionResult', (data) => {
        const transcriptionMessage = document.createElement('div');
        transcriptionMessage.classList.add('assistant-message');
        transcriptionMessage.textContent = data.message;
        messageList.appendChild(transcriptionMessage);
        messageList.scrollTop = messageList.scrollHeight;
    });

    // Handle errors
    socket.on('error', (data) => {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = data.message;
        messageList.appendChild(errorMessage);
        messageList.scrollTop = messageList.scrollHeight;
    });

    socket.on('connect', () => {
        console.log('Socket.IO Connected');
        deviceStatus.textContent = 'Device Status: Online';
    });

    socket.on('disconnect', () => {
        console.warn('Socket.IO Disconnected');
        deviceStatus.textContent = 'Device Status: Offline';
    });

    socket.on('error', (error) => {
        console.error('Socket.IO Error:', error);
    });
});