/* Message */

let form = document.querySelector('.conversation-compose');
let conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessageSent);

function newMessageSent(e) {
	let input = e.target.input;

	if (input.value) {
		let message = buildMessage(input.value, 'message_sent');
		conversation.appendChild(message);
		newMessageReception(input.value);
	}

	input.value = '';
	conversation.scrollTop = conversation.scrollHeight;

	e.preventDefault();
}

function newMessageReception(userMsg) {
	let id = document.getElementById("botId");
	const options = {
		method: "POST",
		body: JSON.stringify({msg: userMsg}),
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		}
	}

	fetch("http://localhost:3000/bot/" + id.textContent.trim(), options)
    .then(function(response){
        return response.json();
    })
	.then(function(response){
		if (response.msg) {
			let message = buildMessage(response.msg, 'message_received');
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
