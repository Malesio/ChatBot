/* Time */

let messageTime = document.querySelectorAll('.message .time');

deviceTime.innerHTML = moment().format('h:mm');

setInterval(function() {
	deviceTime.innerHTML = moment().format('h:mm');
}, 1000);

for (let i = 0; i < messageTime.length; i++) {
	messageTime[i].innerHTML = moment().format('h:mm A');
}

/* Message */

let form = document.querySelector('.conversation-compose');
let conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessage);

function newMessage(e) {
	let input = e.target.input;

	if (input.value) {
		let message = buildMessage(input.value);
		conversation.appendChild(message);
		animateMessage(message);
	}

	input.value = '';
	conversation.scrollTop = conversation.scrollHeight;

	e.preventDefault();
}

function buildMessage(text) {
	let element = document.createElement('div');

	element.classList.add('message', 'sent');
	element.innerHTML = text;

	return element;
}

function animateMessage(message) {
	setTimeout(function() {
		let tick = message.querySelector('.tick');
		tick.classList.remove('tick-animation');
	}, 500);
}