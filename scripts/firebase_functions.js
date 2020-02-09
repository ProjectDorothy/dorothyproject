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

//Subscription to notify when number of moves changes
var playerMoves = defaultDatabase.ref("moveNo/");
playerMoves.on("value", function (data) {
    var moveNumber = data.val();
    console.log("Number of moves: " + moveNumber.moveNumber);
}, function (error) {
    console.log("Error: " + error.code);
})

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

function updateHealthPlayerA(healthValue) {
    console.log("Updating value");

    playerA.update(
        {
            "health": healthValue
        }
    )
}

function updateHealthPlayerB(healthValue) {
    console.log("Updating value");

    playerB.update(
        {
            "health": healthValue
        }
    )
}

function reset_game() {
    defaultDatabase.ref('/moveNo').update({ 'moveNumber': 0 });
    defaultDatabase.ref('/players/A').update({ 'health': 100 });
    defaultDatabase.ref('/players/B').update({ 'health': 100 });
}

