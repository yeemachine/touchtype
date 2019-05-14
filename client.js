//Uses ML5

let font, video, handL, handR;

function preload(){
  font = loadFont('https://cdn.glitch.com/6fc9e0cd-2858-40cc-80f0-d86fbe978fdc%2FGotham-Thin.otf?1557458059343');
  handR = loadImage('https://cdn.glitch.com/6fc9e0cd-2858-40cc-80f0-d86fbe978fdc%2Fbaseline-pan_tool-24px.svg?1557535921063')
  handL = loadImage('https://cdn.glitch.com/2265e14a-84d1-435d-b7d7-6cf94be2325b%2FLHand.svg?1557762555891')
}

function setup() {
  video = createCapture(VIDEO);
  video.size(640,480)
  video.hide();
  video.class('stream')
  createCanvas(video.width,video.height);
  background(76,0,153);
  poseNet = ml5.poseNet(video,options)
  poseNet.on('pose', poseCapture);
  flock = new Flock(250,['happy', "mother's",'day',':)'])
}

function draw() {
  background(76,0,153);
  // image(video, 0, 0,video.width,video.height);
  poseRender();
  flock.run()
}

function windowResized() {
  resizeCanvas(video.width, video.height);
}



