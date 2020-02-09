// ===========================================FIREBASE START=====================================================

// const firebaseConfig = {
//   apiKey: "AIzaSyDQ3gaHvcFpEkusY-VAS2sgUru_terdUVA",
//   authDomain: "hitmeservermate.firebaseapp.com",
//   databaseURL: "https://hitmeservermate.firebaseio.com",
//   projectId: "hitmeservermate",
//   storageBucket: "hitmeservermate.appspot.com",
//   messagingSenderId: "169795236310",
//   appId: "1:169795236310:web:3a18388d3336351bd7b477"
// };
// firebase.initializeApp(firebaseConfig);

defaultDatabase = firebase.database();

// ===========================================FIREBASE END=====================================================
let video;
let poseNet;
let pose;
let skeleton;
let leftGuard;
let rightGuard;
let leftGuardSprite;
let rightGuardSprite;
let helmetSprite;
let steelArmor;
let helmet;
let armorBox;
let skeleBox;
let animatedSprite;
document.getElementById("sidenav").style.display = "none";

let brain;
let poseLabel;
let flagEnd = false;

function checkBoxes() {
  if (document.getElementById("armor").checked) {
    armorBox = true;
  }
  else {
    armorBox = false;
  }
  if (document.getElementById("skeleton").checked) {
    skeleBox = true;
  }
  else {
    skeleBox = false;
  }
}
function myFunction(x) {
  x.classList.toggle("change");
  if (document.getElementById("sidenav").style.display === "none") {
    document.getElementById("sidenav").style.display = "block";

  }
  else if (document.getElementById("sidenav").style.display === "block") {
    document.getElementById("sidenav").style.display = "none";
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //   if (isMobileDevice){
  //   var constraints = {
  //     audio: false,
  //     video: {
  //       facingMode: {
  //         exact: "environment"
  //       }
  //     }
  //   };
  //   video = createCapture(constraints);
  //   }
  //   else {
  video = createCapture(VIDEO);
  //   }  
  video.size(windowWidth, windowHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  function makeSprite(imageIn) {
    sprite = createSprite(300, 150);
    sprite.addImage(loadImage(imageIn));
    sprite.scale = 0.1;
    return sprite;
  }
  helmetSprite = makeSprite('helmet.png');
  chestGuardSprite = makeSprite('SteelArmour.png');
  leftGuardSprite = makeSprite('leftGuard.png');
  rightGuardSprite = makeSprite('rightGuard.png');
  chestGuardSprite.scale = 1.0;
  helmetSprite.scale = 0.4;

  animatedSprite = createSprite(500, 150, 50, 100);
  animatedSprite.addAnimation('sun', 'sun1', 'sun3');

  let options = {
    inputs: 34, //17 pairs of x,y coords
    outputs: 6, // 
    task: 'classification',
    debug: true
  }
  console.log('brain should load');
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model.json',
    metadata: 'model_meta.json',
    weights: 'model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    //console.log(inputs[0]);
    brain.classify(inputs, gotResult);
  } else { setTimeout(classifyPose, 128); }
}

function gotResult(error, results) {
  //console.log(results[0].label + ' ' + results[0].confidence);
  if (results[0].confidence > 0.75) {
    const poseL = results[0].label;
    detectMotion(poseL);
  }
  classifyPose();
}

let then = "";
let now = "";
function detectMotion(label) {
  if (!flagEnd) {
    now = label;
    if (then != now) {
      console.log("now: " + now + " then: " + then);
      const move = then.replace("Start", "");
      if (then.includes("Start") &&
        now.includes(move)) {
        poseLabel = move
        //flagEnd = true;
      } else {
        then = now
      }
    }
  }
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    let largestPose = 0;
    // if (poses.length>1){
    //   for (let i = 1; i<poses.length; i++)
    //   {
    //     if ((poses[i].pose.leftEye.y-poses[i].pose.leftHip.y) > (poses[i-1].pose.leftEye.y-poses[i-1].pose.leftHip.y)){
    //       largestPose = i;
    //     }
    //   }
    // }
    pose = poses[largestPose].pose;
    skeleton = poses[largestPose].skeleton;
  }
}


function modelLoaded() {
  console.log("posenet ready");
}

function sequence(label) {
  position[0] = label;
  console.log("what" + position[0]);
  if (position[0] != poseLabel) {
    position[1] = poseLabel;
  }
}

function action() {
  let move;
  sequence(poseLabel);
  if (position[0].includes('Start')) {
    move = position[0].replace('Start', '');
  }
  if (position[1].includes(move)) {
    return move;
  }
}

function draw() {
  image(video, 0, 0, windowWidth, windowHeight);

  if (pose) {

    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    // let avx = (pose.rightWrist.x+pose.leftWrist.x)/2;
    // let avy = (pose.rightWrist.y+pose.leftWrist.y)/2;
    // let distx = abs(pose.rightWrist.x-pose.leftWrist.x);
    // if (distx>200 && distx<250){
    // animatedSprite.velocity.x = (avx-animatedSprite.position.x)/10;
    // animatedSprite.velocity.y = (avy-animatedSprite.position.y)/10;
    //square(avx, avy, d*(distx/100));
    //}
    if (skeleBox) {
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill(0, 255, 0);
        ellipse(x, y, 16, 16);
      }
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(2);
        stroke(255);
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }

    if (armorBox) {
      function armordraw(dot1, dot2, armor) {
        let armorposx = (dot1.x + dot2.x) / 2;
        let armorposy = (dot1.y + dot2.y) / 2;
        let anglearmor = atan2((dot1.x - dot2.x), (dot1.y - dot2.y)) * 180 / PI;
        let armorsize = sqrt((dot1.x - dot2.x) ^ 2 + (dot1.y - dot2.y) ^ 2);

        //console.log(armorsize);
        // armor.scale = armorsize/abs(dot1.y - dot2.y);
        // console.log(armor.height);
        //armor.width = (armorsize/h)/10;
        armor.velocity.x = (armorposx - armor.position.x) / 10;
        armor.velocity.y = (armorposy - armor.position.y) / 10;
        armor.rotation = 180 - anglearmor;
      }

      armordraw(pose.leftElbow, pose.leftWrist, leftGuardSprite);
      armordraw(pose.rightElbow, pose.rightWrist, rightGuardSprite);

      let chestposx = (((pose.leftShoulder.x + pose.rightShoulder.x) / 2) + ((pose.leftHip.x + pose.rightHip.x) / 2)) / 2;
      let chestposy = (((pose.leftShoulder.y + pose.leftHip.y) / 2) + ((pose.rightShoulder.y + pose.rightHip.y) / 2)) / 2;
      chestGuardSprite.velocity.x = (chestposx - chestGuardSprite.position.x) / 2;
      chestGuardSprite.velocity.y = ((chestposy + ((eyeR.y + eyeL.y) / 2 - pose.nose.y)) - chestGuardSprite.position.y) / 2;
      helmetSprite.velocity.x = ((eyeR.x + eyeL.x) / 2 - helmetSprite.position.x) / 2;
      helmetSprite.velocity.y = (((eyeR.y + eyeL.y) / 2 + ((eyeR.y + eyeL.y) / 2 - pose.nose.y) * 2) - helmetSprite.position.y) / 2;

      //armordraw(pose.rightShoulder, pose.rightElbow, imageSprite);
      drawSprites();
    }

    fill(255, 0, 255);
    noStroke();
    textSize(100);
    textAlign(CENTER, CENTER);

    // Firebase initialisation
    function updateInferenceA(inferenceVal) {
      console.log("Updating value A");
      defaultDatabase.ref("lastMove/").update({ "A": inferenceVal });
    }

    if (poseLabel) {
      console.log(poseLabel);
      updateInferenceA(poseLabel);
      //text(poseLabel, width/2, height/2); 
    }
  }



}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
