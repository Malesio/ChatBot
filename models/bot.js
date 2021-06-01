class Bot{

    constructor(data){

        this.brain = [];
        this.interface = [];

        if(undefined != data.id){
            this.id = data.id;
        }
        if(undefined != data.name){
            this.name = data.name;
        }
        if(undefined != data.surname){
            this.surname = data.surname;
        }
        if(undefined != data.personality){
            this.personality = data.personality;
        }
        
        this.brain.push("standard");
        this.interface.push("standard");
    }

}

module.exports = Bot;