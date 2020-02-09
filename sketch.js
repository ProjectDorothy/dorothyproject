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

function checkBoxes(){
  if (document.getElementById("armor").checked){
    armorBox = true;
  }
  else {
    armorBox = false;
  }
  if (document.getElementById("skeleton").checked){
    skeleBox = true;
  }
  else {
    skeleBox = false;
  }
}
function myFunction(x) {
  x.classList.toggle("change");
  if(document.getElementById("sidenav").style.display === "none"){
    document.getElementById("sidenav").style.display = "block";

  }
  else if(document.getElementById("sidenav").style.display === "block"){
    document.getElementById("sidenav").style.display = "none";
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (isMobileDevice){
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  };
  video = createCapture(constraints);
  }
  else {
    video = createCapture(VIDEO);
  }  
  video.size(windowWidth,windowHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  function makeSprite(imageIn){
    sprite = createSprite(300, 150);
    sprite.addImage(loadImage(imageIn));
    sprite.scale = 0.2;
    return sprite;
  }
  helmetSprite = makeSprite('helmet.png');
  chestGuardSprite = makeSprite('SteelArmour.png');
  leftGuardSprite = makeSprite('leftGuard.png');
  rightGuardSprite = makeSprite('rightGuard.png');
  chestGuardSprite.scale = 1.5;
  helmetSprite.scale = 0.7;

  animatedSprite = createSprite(500, 150, 50, 100);
  animatedSprite.addAnimation('sun', 'sun1', 'sun3');
}

function gotPoses(poses){
  // console.log(poses);
  if (poses.length>0){
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


function modelLoaded(){
   console.log("posenet ready");
}

function draw() {
  image(video, 0, 0, windowWidth, windowHeight);
  
  if (pose){
    
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
    if (skeleBox){
      for (let i = 0; i < pose.keypoints.length; i++){
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill(0, 255, 0);
        ellipse(x, y, 16, 16);
      }
      for (let i = 0; i < skeleton.length; i++){
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(2);
        stroke(255);
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }

    if (armorBox){
      function armordraw(dot1,dot2, armor) {
        let armorposx = (dot1.x + dot2.x)/2;
        let armorposy = (dot1.y + dot2.y)/2;
        let anglearmor = atan2((dot1.x-dot2.x),(dot1.y - dot2.y))*180/PI;
        let armorsize = sqrt((dot1.x-dot2.x)^2+(dot1.y-dot2.y)^2);

        //console.log(armorsize);
        // armor.scale = armorsize/abs(dot1.y - dot2.y);
        // console.log(armor.height);
        //armor.width = (armorsize/h)/10;
        armor.velocity.x = (armorposx-armor.position.x)/10;
        armor.velocity.y = (armorposy-armor.position.y)/10;
        armor.rotation = 180-anglearmor;
      }
    
      armordraw(pose.leftElbow, pose.leftWrist, leftGuardSprite);
      armordraw(pose.rightElbow, pose.rightWrist, rightGuardSprite);
      let chestposx = (((pose.leftShoulder.x + pose.rightShoulder.x)/2)+((pose.leftHip.x + pose.rightHip.x)/2))/2;
      let chestposy = (((pose.leftShoulder.y + pose.leftHip.y)/2)+((pose.rightShoulder.y + pose.rightHip.y)/2))/2;
      chestGuardSprite.velocity.x = (chestposx-chestGuardSprite.position.x)/10;
      chestGuardSprite.velocity.y = ((chestposy+((eyeR.y+eyeL.y)/2-pose.nose.y))-chestGuardSprite.position.y)/10;
      helmetSprite.velocity.x = ((eyeR.x+eyeL.x)/2-helmetSprite.position.x)/10;
      helmetSprite.velocity.y = (((eyeR.y+eyeL.y)/2+((eyeR.y+eyeL.y)/2-pose.nose.y)*2)-helmetSprite.position.y)/10;
      //armordraw(pose.rightShoulder, pose.rightElbow, imageSprite);
      drawSprites();
    }
  }
  


}

function isMobileDevice(){
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
