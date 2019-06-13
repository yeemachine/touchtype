//Uses PoseNet

let font, video, handL, handR;

function videoLoaded(){
  imageElement = document.querySelector('video');
}

function preload(){
  font = loadFont('https://cdn.glitch.com/6fc9e0cd-2858-40cc-80f0-d86fbe978fdc%2FGotham-Thin.otf?1557458059343');
  handR = loadImage('https://cdn.glitch.com/6fc9e0cd-2858-40cc-80f0-d86fbe978fdc%2Fbaseline-pan_tool-24px.svg?1557535921063')
  handL = loadImage('https://cdn.glitch.com/2265e14a-84d1-435d-b7d7-6cf94be2325b%2FLHand.svg?1557762555891')
}

function setup() {
  video = createCapture(VIDEO,videoLoaded);
  video.size(640,640,WEBGL)
  video.hide();
  video.class('stream')
  
  createCanvas(windowWidth,windowHeight);
  background(76,0,153);
  
  // let modelOptions = {
  //   architecture: 'ResNet50',
  //   outputStride: 32,
  //   inputResolution: 257
  // }
  // posenet.load(modelOptions).then(function(model){
  //   poseNet = model
  //   poseNetRun();
  // })
  // bodyPix.load().then(function(model){
  //   bodyNet = model
  //   bodyNetRun();
  // })
  flock = new Flock(250,['happy', "mother's",'day',':)'])
}

function draw() {
  // background(76,0,153);
  // image(bodyNetImage, 0, 0,640,640);
  // poseRender();
  flock.run()
}

function windowResized() {
  resizeCanvas(video.width, video.height);
}



