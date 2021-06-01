let intervalID = window.setInterval(fetchMsg, 1000);
let div = document.getElementsByClassName("conversation-container")[0];
let id = document.getElementById("botId");

function fetchMsg(callback){
    fetch("http://localhost:3000/" + id.textContent)
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        if(json.msg){
           let newMsg = document.createElement("div");
            newMsg.classList.add("message_received");
            newMsg.innerText = json.msg;
            div.appendChild(newMsg);  
        }
       
    })
}
