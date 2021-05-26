class Bot{

    constructor(data){
        
        if(undefined != data.id){
            this.id = data.id;
        }
        if(undefined != data.name){
            this.name = data.name;
        }
        if(undefined != data.surname){
            this.surname = data.surname;
        }
        if(undefined != data.brain){
            this.brain = data.brain;
        }
        if(undefined != data.interface){
            this.interface = data.interface;
        }
        
    }

}

module.exports = Bot;