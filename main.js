const main={
    $:{
        actions: document.querySelector('[data-id="actions"]'),
        actionsitems: document.querySelector('[data-id="items"]'),
        resetbtn: document.querySelector('[data-id="reset-btn"]'),
        startbtn: document.querySelector('[data-id="start-btn"]'),
        circleshadow: document.querySelectorAll('[data-id="circle"]'),
        model: document.querySelector('[data-id="model"]'),
        modeltext: document.querySelector('[data-id="model-text"]'),
        modelbtn: document.querySelector('[data-id="model-btn"]'),
        turn: document.querySelector('[data-id="turn"]'),
    },
    state:{
        moves:[],
    },
    getgamestatus(moves){
        const p1moves = moves.filter(move => move.playerId===1).map(move => +move.circleId)
        const p2moves = moves.filter(move => move.playerId===2).map(move => +move.circleId)
        console.log(p1moves);

         const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];
        let winner =null 
        winningPatterns.forEach(pattern =>{
            const p1wins = pattern.every((v) => p1moves.includes(v))
            const p2wins = pattern.every((v) => p2moves.includes(v))
            if(p1wins)  winner = 1;
            if(p2wins)  winner = 2;

        });
        return {
            status :  moves.length === 9 || winner != null ? 'complete':'in-progress',
            winner ,
        }
    },
    resetGame()  {
        main.state.moves = [];
        main.$.circleshadow.forEach((circle) => circle.replaceChildren());
        main.$.model.classList.add("hidden");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnIcon.classList.add("fa-solid", "fa-x", "yellow");
        turnLabel.innerText = "player 1, you are up!";
        turnLabel.className = "turquoise";
        main.$.turn.replaceChildren(turnIcon, turnLabel);
    },


    init() {
        main.registerEventListeners();
    },
    registerEventListeners(){                                               
    main.$.actions.addEventListener("click",()=>{
        main.$.actionsitems.classList.toggle('hidden');
    });
    main.$.resetbtn.addEventListener("click",main.resetgame);
    main.$.startbtn.addEventListener("click",main.resetgame);
    main.$.modelbtn.addEventListener("click",()=>{
        main.state.moves=[]
        main.$.circleshadow.forEach((circle) => circle.replaceChildren());

        main.$.model.classList.add("hidden");
    });
    main.$.circleshadow.forEach((circle) => {
        circle.addEventListener('click',(event)=>{
            const hasmoves = (circleId) => {
                const exisitingmove = main.state.moves.find(
                    (move) => move.circleId === circleId
                );
                return exisitingmove !== undefined;
            };
            if (hasmoves(+circle.id)){
                return;
            }
            const lastmove = main.state.moves.at(-1);
            const getOppositeplayer = (playerId) => (playerId === 1 ? 2 : 1);
            const currentplayer = 
            main.state.moves.length === 0
            ? 1 : getOppositeplayer(lastmove.playerId);
            const nextpalyer = getOppositeplayer(currentplayer)
            const circleicon = document.createElement("i");
            const turnicon = document.createElement("i");
            const turnLabel = document.createElement('p')
            turnLabel.innerText=`player ${nextpalyer}, you are up!`;
            

            if(currentplayer === 1){
            circleicon.classList.add("fa-solid" ,"fa-x","yellow");
            turnicon.classList.add("fa-solid" ,"fa-o","turquoise");
            turnLabel.classList='turquoise';
            }
            else{
            circleicon.classList.add("fa-solid" ,"fa-o","turquoise");
            turnicon.classList.add("fa-solid" ,"fa-x","yellow");
            turnLabel.classList='yellow';
            } 
            main.$.turn.replaceChildren(turnicon,turnLabel)
            main.state.moves.push({
                circleId:+circle.id,
                playerId: currentplayer
            })
            // main.state.currentplayer=main.state.currentplayer === 1 ? 2 : 1;
            
            circle.replaceChildren(circleicon);
            const game  = main.getgamestatus(main.state.moves)
            if (game.status === "complete"){
                main.$.model.classList.remove("hidden");
                let message = ''
                if (game.winner) {
                    message =`player ${game.winner} wins!`;
                }
                else{
                    message = "tie-game!";
                }
                main.$.modeltext.textContent = message;
        }
        
        });
    });
},  
};
window.addEventListener('load',main.init);