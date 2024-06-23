//Dummy JSON responses
let data = [

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [2, 5, 2, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 5, 5, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [0, 3, 1, 4]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [5, 4, 1, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 2,
                "symbolIDs": [1, 1, 5, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [2, 2, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [5, 5, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 3,
                "symbolIDs": [2, 2, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [4, 5, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 5, 5, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 9,
                "symbolIDs": [3, 3, 3, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [4, 4, 4, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [0, 0, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [1, 1, 1, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [2, 5, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [2, 2, 2, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [4, 3, 0, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [3, 3, 3, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [2, 2, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [0, 1, 5, 4]
            }
        }
    },

]

// simple application configuration
let config  = {width: 1920, height: 1080}

//Global Variables
let app;
let spines = [];
let columns = [];
let labels = {};
let balance = 1000; //Not Secure
let stake = 1


// wait for DOM before creating application
window.addEventListener('load', function() {
    //Create a Pixi Application
    app = new PIXI.Application(config);

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    //Preload needed assets - setup function is ran within after assets are loaded.
    preload();
    
})

function preload()
{
    //Load spine data - ATLAS & PNG are loaded automatically with the JSON file.
    console.log("Preloading starting...");
    PIXI.Loader.shared.onProgress.add(loadProgressHandler);
    PIXI.Loader.shared
        .add('cherry', 'assets/symbols/symbol_00.json')
        .add('lemon', 'assets/symbols/symbol_01.json')
        .add('orange', 'assets/symbols/symbol_02.json')
        .add('plum', 'assets/symbols/symbol_03.json')
        .add('grapes', 'assets/symbols/symbol_04.json')
        .add('watermelon', 'assets/symbols/symbol_05.json')
        .load(setup);

}

function loadProgressHandler(loader, resource){
    //Display the file being loaded
    console.log("Loaded: " + resource.url); 
}

function setup()
{
    //Add Spine Animation types to spines array to be accessed elsewhere
    for(let i = 0; i < 6; i++) //Amount of possible fruits
    {
        spines[i] = [];
        let spineData;
        //Switch case to load the needed spine data
        switch(i)
        {
            case 0:
                spineData = PIXI.Loader.shared.resources.cherry.spineData;
                break;
            case 1:
                spineData = PIXI.Loader.shared.resources.lemon.spineData;
                break;
            case 2:
                spineData = PIXI.Loader.shared.resources.orange.spineData;
                break;
            case 3:
                spineData = PIXI.Loader.shared.resources.grapes.spineData;
                break;
            case 4:
                spineData = PIXI.Loader.shared.resources.plum.spineData;
                break;
            case 5:
                spineData = PIXI.Loader.shared.resources.watermelon.spineData;
                break;
            default:
                console.log("Default selected for loading spine data.");
        }
        for(let j = 0; j < 4; j++) //Max amount of fruits at any given time
            {
                spines[i][j] = new PIXI.spine.Spine(spineData);
            }
    }

    //Rectangles that repersent the four slot columns
    let tempWidth = config.width / 5; //5 gives plenty of margin space
    columns.push(new PIXI.Rectangle(tempWidth, config.height / 2));
    columns.push(new PIXI.Rectangle(tempWidth * 2, config.height / 2));
    columns.push(new PIXI.Rectangle(tempWidth * 3, config.height / 2));
    columns.push(new PIXI.Rectangle(tempWidth * 4, config.height / 2));

    //Setup Spin Button & stake adjustment buttons
    labels["spinButton"] = new PIXI.Text("SPIN");
    labels["spinButton"].interactive = true;
    labels["spinButton"].on('pointerdown', spinSlots);

    labels["stakeIncrease"] = new PIXI.Text("+");
    labels["stakeIncrease"].interactive = true;
    labels["stakeIncrease"].on('pointerdown', increaseSmallStake);

    labels["stakeDecrease"] = new PIXI.Text("-");
    labels["stakeDecrease"].interactive = true;
    labels["stakeDecrease"].on('pointerdown', decreaseSmallStake);

    labels["stakeBigIncrease"] = new PIXI.Text("+");
    labels["stakeBigIncrease"].interactive = true;
    labels["stakeBigIncrease"].on('pointerdown', increaseBigStake);

    labels["stakeBigDecrease"] = new PIXI.Text("-");
    labels["stakeBigDecrease"].interactive = true;
    labels["stakeBigDecrease"].on('pointerdown', decreaseBigStake);

    //Display Text
    labels["balance"] = new PIXI.Text("Balance: " + balance);
    labels["stake"] = new PIXI.Text("Stake Amount: " + stake);
    labels["win"] = new PIXI.Text("");

    //Make all labels base the same
    for(const key of Object.keys(labels))
        {
            labels[key].style = {fill: "white", fontSize: 42};
        }
    labels["stakeBigIncrease"].style = {fill: "white", fontSize: 50};
    labels["stakeBigDecrease"].style = {fill: "white", fontSize: 50};
    
    //Labels positions
    labels["stake"].position.set(config.width / 2 - labels["stake"].width / 2, config.height - 100);
    labels["stakeIncrease"]. position.set(labels["stake"].position.x + labels["stake"].width + 100, labels["stake"].position.y);
    labels["stakeDecrease"]. position.set(labels["stake"].position.x  - 100, labels["stake"].position.y);
    labels["stakeBigIncrease"]. position.set(labels["stake"].position.x + labels["stake"].width + 175, labels["stake"].position.y - 5);
    labels["stakeBigDecrease"]. position.set(labels["stake"].position.x  - 175, labels["stake"].position.y - 5);
    labels["balance"].position.set(config.width / 2 - labels["balance"].width / 2, 75);
    labels["spinButton"].position.set(config.width / 2 - labels["spinButton"].width / 2, config.height - 200);

    //Adding all labels to stage
    for(const key of Object.keys(labels))
        {
            app.stage.addChild(labels[key]);
        }
}

function increaseSmallStake()
{
    stake = parseFloat((stake + 0.2).toFixed(2));
    labels["stake"].text = "Stake Amount: " + stake;
}

function decreaseSmallStake()
{
    if(stake <= 0.2){stake = 0.2; /*min stake*/}
    else{stake = parseFloat((stake - 0.2).toFixed(2));}
    labels["stake"].text = "Stake Amount: " + stake;
}

function increaseBigStake()
{
    stake = parseFloat((stake + 1).toFixed(2));
    labels["stake"].text = "Stake Amount: " + stake;
}

function decreaseBigStake()
{
    if(stake === 1){stake = 1; /*min stake*/}
    else if (stake > 1){stake = parseFloat((stake - 1).toFixed(2));}
    labels["stake"].text = "Stake Amount: " + stake;
}

function spinSlots()
{
    //Take stake from balance and display the new balance
    balance = parseFloat((balance - stake).toFixed(2));
    labels["balance"].text = "Balance: " + balance;

    //Remove all sprites from screen
    for(let i = 0; i < spines.length; i++)
        {
            for(let j = 0; j < spines[i].length; j++)
                {
                    spines[i][j].state.setAnimation(0, 'static', true);
                    app.stage.removeChild(spines[i][j]);
                }
        }
    for(const key of Object.keys(labels))
        {
            labels[key].interactive = false;
        }
    
    //Randomly select response from dummy JSON
    let response = data[Math.floor(Math.random() * data.length)].response.results;

    let fruits = [0, 0, 0, 0, 0, 0];
    for(let i = 0; i < response.symbolIDs.length; i++)
        {
            switch(response.symbolIDs[i]){
                case 0:
                    spines[0][fruits[0]].state.setAnimation(0, 'static', true);
                    spines[0][fruits[0]].position.set(columns[i].x,columns[i].y);
                    app.stage.addChild(spines[0][fruits[0]]);
                    fruits[0] += 1;
                    break;
                case 1:
                    spines[1][fruits[1]].state.setAnimation(0, 'static', true);
                    spines[1][fruits[1]].position.set(columns[i].x,columns[i].y);
                    app.stage.addChild(spines[1][fruits[1]]);
                    fruits[1] += 1;
                    break;
                case 2:
                    spines[2][fruits[2]].state.setAnimation(0, 'static', true);
                    spines[2][fruits[2]].position.set(columns[i].x,columns[i].y);
                    app.stage.addChild(spines[2][fruits[2]]);
                    fruits[2] += 1;
                    break;
                case 3:
                    spines[3][fruits[3]].state.setAnimation(0, 'static', true);
                    spines[3][fruits[3]].position.set(columns[i].x,columns[i].y);
                    app.stage.addChild(spines[3][fruits[3]]);
                    fruits[3] += 1;
                    break;
                case 4:
                    spines[4][fruits[4]].state.setAnimation(0, 'static', true);
                    spines[4][fruits[4]].position.set(columns[i].x,columns[i].y);
                    app.stage.addChild(spines[4][fruits[4]]);
                    fruits[4] += 1;
                    break;
                case 5:
                    spines[5][fruits[5]].state.setAnimation(0, 'static', true);
                    spines[5][fruits[5]].position.set(columns[i].x,columns[i].y);
                    app.stage.addChild(spines[5][fruits[5]]);
                    fruits[5] += 1;
                    break;
                default:
                    console.log("Default selected for displaying slot results - Column " + i);
            }
        }

    //Add win to balance if there no win nothing will be added to the balance
    if(response.win != 0)
        {
            let win = response.win * stake;
            balance = parseFloat((balance + win).toFixed(2));
            labels["balance"].text = "Balance: " + balance;
            labels["win"].text = "You've Won!";
            labels["win"].position.set(config.width / 2 - labels["win"].width / 2, 150)

            //make winning symbols animate
            let winningSymbol = 0;
            let previousBiggest = 0;
            //Find the symbol that shows up the most
            for(let i = 0; i < fruits.length; i++)
                {
                    if(fruits[i] > previousBiggest)
                        {
                            previousBiggest = fruits[i];
                        }
                }
            winningSymbol = fruits.indexOf(previousBiggest);
            //Play the win animation for the correct symbols
            for(let j = 0; j < spines[winningSymbol].length; j++)
                {
                    spines[winningSymbol][j].state.setAnimation(0, 'win', true);
                }
        }
    else
    {
        labels["win"].text = "Better luck next time!";
        labels["win"].position.set(config.width / 2 - labels["win"].width / 2, 150)
    }
        //interactivity readded for buttons after spin completion
        for(const key of Object.keys(labels))
            {
                if(key != "balance" && key != "stake" && key != "win")
                    {
                        labels[key].interactive = true;
                    }
            }  
}