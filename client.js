//-----Version that uses ML5 instead of Tensorflow------//

let font, video, handL, handR, poseNet, play;
let videoW = 640, videoH = 480

//Run when PoseNet model is loaded
const modelLoaded = () => {
    poseNet.on('pose', e=>{poseCapture(e,mainP5)});
}

//---Main P5 Canvas---//
const instance1 = function( p ) { 
  p.preload = function(){
    font = p.loadFont('https://cdn.glitch.com/6fc9e0cd-2858-40cc-80f0-d86fbe978fdc%2FGotham-Thin.otf?1557458059343');
    handR = p.loadImage('https://cdn.glitch.com/6fc9e0cd-2858-40cc-80f0-d86fbe978fdc%2Fbaseline-pan_tool-24px.svg?1557535921063')
    handL = p.loadImage('https://cdn.glitch.com/2265e14a-84d1-435d-b7d7-6cf94be2325b%2FLHand.svg?1557762555891')
  }
  p.setup = function() {
    video = p.createCapture(p.VIDEO);
      video.size(videoW,videoH)
      video.class('stream')
      video.parent(document.querySelector('.vidLoader'))
    p.createCanvas(videoW,videoH);
    resizeKeepAspect(videoW/videoH)
    p.background(76,0,153);
    //Loads PoseNet Model
    poseNet = ml5.poseNet(video,options,modelLoaded) 
    //Create new Flock of Boids (simulated birds)
    let sentence = "hello/welcome/greetings/bonjour/good day/howdy"
    let words = sentence.split("/");
    let maxBoids = (isMobile) ? 150 : 250
    flock = new Flock(maxBoids,words,p)
  }
  p.draw = function() {
    //Repaints bg every frame
    p.background(76,0,153);
    //Update pose render function
    poseRender(p);
    //Update Flock of Boids
    flock.run()
  }
  p.windowResized = function() {
  resizeKeepAspect(videoW/videoH)
  }
};
let mainP5 = new p5(instance1, 'mainP5');

//---Sub P5 Canvas---//
const instance2 = function( p ) { 
  p.setup = function() {
    p.createCanvas(videoW,videoH);
    p.background(76,0,153);
  }
  p.draw = function() {
    p.background(76,0,153);
    //Render Pose Skeleton
    if(!isMobile){
      if(lerpPoses.length > 0 && play !== true){
        for(let e of lerpPoses){
          if(e !== undefined && e.pose.score > 0){
            let activePoints = []
            let keypoints = e.pose.keypoints
            let figure = new Figure(keypoints,p)
            figure.allLines()
            figure.allPoints()
          }
        }
      }
    }
  }
};
let subP5 = new p5(instance2, 'subP5');

//Check window ratio against canvas ratio
const resizeKeepAspect = (ratio) => {
  if(mainP5.windowWidth/mainP5.windowHeight > ratio){
    document.querySelectorAll('video, canvas').forEach(e=>{e.classList.add('horizontal')})
  }else{
    document.querySelectorAll('video, canvas').forEach(e=>{e.classList.remove('horizontal')})
  }
}

//UI Elements
const toggleDemo = () => {
  play = !play
  let elements = document.querySelectorAll('.card,body,.material-icons')
  if (play){
    elements.forEach(e=>{e.classList.add('expand')})
  }else{
    elements.forEach(e=>{e.classList.remove('expand')})
  }
}
['mousedown','touchstart'].forEach( evt => 
    document.querySelector('.material-icons').addEventListener(evt, toggleDemo, false)
);
if(isMobile){document.querySelector('span').innerHTML = "Move your face to interact with the type slideshow!"}










