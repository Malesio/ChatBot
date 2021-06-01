let intervalID = window.setInterval(withFetch, 1000);
let div = document.getElementsByClassName("conversation-container")[0];

function withFetch(callback){
    fetch("http://localhost:3000")
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
