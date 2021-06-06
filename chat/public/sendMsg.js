/* Message */

let form = document.querySelector('.conversation-compose');
let conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessageSent);

function newMessageSent(e) {
	let input = e.target.input;

	if (input.value) {
		let message = buildMessage(input.value, 'message_sent');
		conversation.appendChild(message);
		newMessageReception();
	}

	input.value = '';
	conversation.scrollTop = conversation.scrollHeight;

	e.preventDefault();
}

function newMessageReception() {
	let id = document.getElementById("botId");
	fetch("http://localhost:3000/" + id.textContent)
    .then(function(response){
        return response.json();
    })
	.then(function(response){
		if (response.msg) {
			let message = buildMessage('message_received');
			conversation.appendChild(message);
		}
		conversation.scrollTop = conversation.scrollHeight;
	});
}

function buildMessage(text, type) {
	let element = document.createElement('div');

	element.classList.add(type);
	element.innerHTML = text;

	return element;
}
