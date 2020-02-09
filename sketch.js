let video;
let poseNet;
let pose;
let skeleton;

let position = new Array(2);

let brain;
let poseLabel;
let flagEnd = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth,windowHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  //.on if you find a pose call gotPoses
  poseNet.on('pose', gotPoses);
  
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
    for (let i=0; i < pose.keypoints.length; i++) {
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
  if (results[0].confidence > 0.85) {
    const poseL = results[0].label;
    detectMotion(poseL);
  }
  classifyPose();
}

let then = "";
let now = "";
function detectMotion(label) {
  if(!flagEnd){
    now = label;
    if (then != now) {
      console.log("now: " + now + " then: " + then);
      const move = then.replace("Start","");
      if(then.includes("Start") &&
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
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready!');
}


function sequence(label) { 
  position[0] = label;
  console.log("what"+ position[0]);
  if(position[0] != poseLabel){
    position[1] = poseLabel;
  }
}

function action() {
  let move;
  sequence(poseLabel);
  if(position[0].includes('Start')){
    move = position[0].replace('Start','');
  }
  if(position[1].includes(move)){
    return move;  
  }
}

function draw() {
  push();
  //next 2 lines mirror image, only for testing on front-facing camera
  translate(video.width, 0);
  scale(-1,1);
  image(video, 0, 0,windowWidth,windowHeight);
  
  if (pose) {
    // let eyeR = pose.rightEye;
    // let eyeL = pose.leftEye;
    // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    // fill(255,0,0);
    // ellipse(pose.nose.x, pose.nose.y, d);
    
    for (let i = 0; i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(100,100,100);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let pa = skeleton[i][0];
      let pb = skeleton[i][1];
      strokeWeight(2);
      stroke(0);
      line(pa.position.x, pa.position.y, pb.position.x, pb.position.y);   
    }
  }
  pop();
  
  fill(255, 0, 255);
  noStroke();
  textSize(100);
  textAlign(CENTER, CENTER);
  if(poseLabel) {
    //console.log(poseLabel);
    text(poseLabel, width/2, height/2); 
  }
}