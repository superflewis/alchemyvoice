
const chatSocket = new WebSocket('ws://localhost:3000/chat');

chatSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerText = data.message;
    messages.appendChild(messageElement);
};

document.getElementById('send-message').addEventListener('click', () => {
    const userInput = document.getElementById('user-input');
    chatSocket.send(JSON.stringify({ message: userInput.value }));
    userInput.value = '';
});
