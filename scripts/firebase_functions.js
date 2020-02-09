// your page initialization code here
// the DOM will be available here
const firebaseConfig = {
    apiKey: "AIzaSyDQ3gaHvcFpEkusY-VAS2sgUru_terdUVA",
    authDomain: "hitmeservermate.firebaseapp.com",
    databaseURL: "https://hitmeservermate.firebaseio.com",
    projectId: "hitmeservermate",
    storageBucket: "hitmeservermate.appspot.com",
    messagingSenderId: "169795236310",
    appId: "1:169795236310:web:3a18388d3336351bd7b477"
};
firebase.initializeApp(firebaseConfig);

defaultDatabase = firebase.database();

//Get available moves once
var moveRef = defaultDatabase.ref("moves/");
moveRef.once("value", function (data) {
    var values = data.val();
    console.log(typeof values);
    console.log(values);

    for (var property in values) {
        console.log(Object.getOwnPropertyDescriptor(values, property).value.damage);
    }

}, function (error) {
    console.log("Error: " + error.code);
});

/*
====================================
CODE THAT GETS POSE OF PLAYER B
{----INSERT HERE----}
====================================
*/

// Get health of player A
/*
function getHealthPlayerA() {
    var health;

    defaultDatabase.ref("players/A").once("value", function (data) {
        health = data.val();
        console.log("Health of A:" + health.health);
        return health.health;
    }, function (error) {
        console.log("Error: " + error.error);
    });
    // return health.health;
}
*/

function getHealthPlayer(playerId) {
    return defaultDatabase.ref("players/" + playerId).once("value")
        .then(data => {
            return data.val().health;
        })
        .catch(error => {
            console.log("Error: " + error.error);
        });
}

// function getHealthPlayerA() {
//     return defaultDatabase.ref("players/A").once("value")
//         .then(data => {
//             return data.val().health;
//         })
//         .catch(error => {
//             console.log("Error: " + error.error);
//         });
// }

// function getHealthPlayerB() {
//     var health;

//     defaultDatabase.ref("players/B").once("value", function (data) {
//         health = data.val();
//         console.log("Health of B:" + health.health);
//         return health.health;
//     }, function (error) {
//         console.log("Error: " + error.error);
//     });
//     // return health.health;
// }

function turn_number() {
    let turn;
    defaultDatabase.ref("moveNo").once("value", function (data) {
        turn = data.val()
    });
    return turn.moveNumber;

}

//Subscription to notify when number of moves changes
var playerMoves = defaultDatabase.ref("moveNo/");
playerMoves.on("value", function (data) {
    var moveNumber = data.val();
    console.log("Number of moves: " + moveNumber.moveNumber);
}, function (error) {
    console.log("Error: " + error.code);
})

var playerA = defaultDatabase.ref("players/A");
var playerB = defaultDatabase.ref("players/B");

/*
//Get health value of player A
var playerA = defaultDatabase.ref("players/A");
playerA.on("value", function (data) {
    var health = data.val();
    console.log("Health player A: " + health.health);
}, function (error) {
    console.log("Error: " + error.code);
});

//Get health value of player B
var playerB = defaultDatabase.ref("players/B");
playerB.on("value", function (data) {
    var health = data.val();
    console.log("Health player B: " + health.health);
}, function (error) {
    console.log("Error: " + error.code);
});
*/

function updateHealthPlayerA(healthValue) {
    console.log("Updating value A");
    defaultDatabase.ref("players/A").update({ "health": healthValue });
}

function updateHealthPlayerB(healthValue) {
    console.log("Updating value B");
    defaultDatabase.ref("players/B").update({ "health": healthValue });
}

function dmg_to_A(dmg_done) {
    getHealthPlayer("A").then(h1 => {
        updateHealthPlayerA(h1 - dmg_done);
    })
}

function dmg_to_B(dmg_done) {
    getHealthPlayer("B").then(h2 => {
        updateHealthPlayerB(h2 - dmg_done);
    })

}

function healA(amount) {
    getHealthPlayer("A").then(h3 => {
        updateHealthPlayerA(h3 + amount);
    })
}

function healB(amount) {
    getHealthPlayer("B").then(h4 => {
        updateHealthPlayerB(h4 + amount);
    })
}

function update_turn() {
    let turn = turn_number() + 1;
    defaultDatabase.ref("moveNo").update({ "moveNumber": turn });
    console.log('turn has updated, it is now turn:' + turn)
}

function reset_game() {
    defaultDatabase.ref('/moveNo').update({ 'moveNumber': 0 });
    defaultDatabase.ref('/players/A').update({ 'health': 100 });
    defaultDatabase.ref('/players/B').update({ 'health': 100 });
}


function getLastKnown() {
    let lastMove;

    defaultDatabase.ref('/lastMove').once("value", function (data) {
        lastMove = data.val();

    });
    return lastMove.A;
    // defaultDatabase.ref("moveNo").once("value", function (data) {
    //     turn = data.val()
    // });
    // return turn.moveNumber;
}

//determine who plays
function whos_turn() {
    let turn = turn_number();
    if (turn % 2 === 0) {
        // console.log('Player A plays')
        return 0
    }
    else {
        // console.log('Player B plays')
        return 1
    }

}

//determine wheter to update AFTER this turn is finished or not
function updt() {
    let turn = turn_number();
    let bool_updt
    if (turn % 2 === 1) {
        bool_updt = 1;
    }
    else {
        bool_updt = 0;
    }
    // return bool_updt;
    console.log(bool_updt);
}
