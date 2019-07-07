//-----Version that uses ML5 instead of Tensorflow------//

let lerpPoses = []; //Array for interpolated PoseNet points

let options = { //PoseNet options
 imageScaleFactor: 0.3,
 outputStride: 16,
 flipHorizontal: true,
 minConfidence: 0.5,
 maxPoseDetections: 5,
 scoreThreshold: 0.5,
 nmsRadius: 20,
 detectionType: 'multiple',
 multiplier: 0.75,
}

//---Smoothing points---//
const poseCapture = (poses,canvas) => { 
  //Locks play button until video loads
  if(document.querySelector('.play').classList.contains('disabled')){
    document.querySelector('.play').classList.remove('disabled')
  }
  if(poses.length > 0){
    if(poses.length < lerpPoses.length){
      lerpPoses = lerpPoses.slice(poses.length)
    }
    for (let [i,e] of poses.entries()){
      if(e.pose.score > 0.25){
        if(lerpPoses[i] === undefined){
          lerpPoses[i] = e
        }else{
          for(let [j,f] of lerpPoses[i].pose.keypoints.entries()){
            let xDif = e.pose.keypoints[j].position.x - f.position.x
            let yDif = e.pose.keypoints[j].position.y - f.position.y

            if(Math.abs(xDif) > 50 || Math.abs(yDif) > 50){
              f.position.x = e.pose.keypoints[j].position.x
              f.position.y = e.pose.keypoints[j].position.y
            }else{
              f.position.x = canvas.lerp(f.position.x,e.pose.keypoints[j].position.x,0.5)
              f.position.y = canvas.lerp(f.position.y,e.pose.keypoints[j].position.y,0.5)
              f.position.dx = xDif
              f.position.dy = yDif
            }
            f.score = e.pose.keypoints[j].score
          }
        }
      }else{
      }
    } 
  }else{
    lerpPoses = []
  }
}

//---For Rendering---//
const poseRender = (canvas) => {
  if(lerpPoses.length > 0 && play === true){
    if(!flock.textChange){
      flock.assemble = true
    }
    flock.portals = []
    //For performance, limit physics to the 1st pose
    if(lerpPoses[0]){
      let keypoints = lerpPoses[0].pose.keypoints
      if (isMobile){
        let nose = keypoints[0]
        flock.portals.push(canvas.createVector(nose.position.x,nose.position.y))
        canvas.ellipse(nose.position.x,nose.position.y,16,16)
      }else{
        let leftWrist = keypoints[10]
        let rightWrist = keypoints[9]
        flock.portals.push(canvas.createVector(leftWrist.position.x,leftWrist.position.y))
        flock.portals.push(canvas.createVector(rightWrist.position.x,rightWrist.position.y))
        canvas.image(handR, keypoints[9].position.x - handR.width/2,keypoints[9].position.y - handR.height/2,16,16);
        canvas.image(handL, keypoints[10].position.x - handL.width/2,keypoints[10].position.y - handL.height/2,16,16);
      } 
    }    
  }else{
    flock.assemble = false
  }
}

//---Class for pose skeleton---//
class Figure {
  constructor(keypoints,canvas) {
    this.points = keypoints
    this.d = canvas.dist(keypoints[0].position.x,keypoints[0].position.y,keypoints[1].position.x,keypoints[1].position.y);
    this.canvas = canvas
  }
  eyes(){
      this.canvas.ellipse(this.points[1].position.x,this.points[1].position.y,this.d/2)
      this.canvas.ellipse(this.points[2].position.x,this.points[2].position.y,this.d/2)
  };
  nose(){        
    this.canvas.ellipse(this.points[0].position.x,this.points[0].position.y,this.d)
  };
  ears(){
    this.canvas.ellipse(this.points[3].position.x,this.points[3].position.y,this.d)
    this.canvas.ellipse(this.points[4].position.x,this.points[4].position.y,this.d)    
  };
  head(){
    this.canvas.push()
      this.canvas.fill(0,0,0,0)
      this.canvas.stroke(118,0,245)
      this.canvas.ellipse(this.points[0].position.x,this.points[0].position.y,this.d*3,this.d*4)
    this.canvas.pop()
  }
  allPoints(){
    for (let e of this.points){
      this.canvas.fill(235, 58, 246)
      this.canvas.ellipse(e.position.x,e.position.y,this.d)
    }
  } 
  allLines(){
    this.canvas.stroke(118,0,245);
    this.canvas.strokeWeight(this.d*.3)
    this.canvas.line(this.points[5].position.x, this.points[5].position.y, this.points[6].position.x, this.points[6].position.y);
    this.canvas.line(this.points[11].position.x, this.points[11].position.y, this.points[12].position.x, this.points[12].position.y);  
    this.canvas.line(this.points[6].position.x, this.points[6].position.y, this.points[12].position.x, this.points[12].position.y);   
    this.canvas.line(this.points[5].position.x, this.points[5].position.y, this.points[11].position.x, this.points[11].position.y);  
    this.canvas.line(this.points[5].position.x, this.points[5].position.y, this.points[7].position.x, this.points[7].position.y);
    this.canvas.line(this.points[7].position.x, this.points[7].position.y, this.points[9].position.x, this.points[9].position.y);
    
    this.canvas.line(this.points[6].position.x, this.points[6].position.y, this.points[8].position.x, this.points[8].position.y);
    this.canvas.line(this.points[8].position.x, this.points[8].position.y, this.points[10].position.x, this.points[10].position.y);
    
    this.canvas.line(this.points[11].position.x, this.points[11].position.y, this.points[13].position.x, this.points[13].position.y);
    this.canvas.line(this.points[13].position.x, this.points[13].position.y, this.points[15].position.x, this.points[15].position.y);
    this.canvas.line(this.points[12].position.x, this.points[12].position.y, this.points[14].position.x, this.points[14].position.y);
    this.canvas.line(this.points[14].position.x, this.points[14].position.y, this.points[16].position.x, this.points[16].position.y);
  }
  torso(){
    this.canvas.line(this.points[5].position.x, this.points[5].position.y, this.points[6].position.x, this.points[6].position.y);
    this.canvas.line(this.points[11].position.x, this.points[11].position.y, this.points[12].position.x, this.points[12].position.y);  
    this.canvas.line(this.points[6].position.x, this.points[6].position.y, this.points[12].position.x, this.points[12].position.y);   
    this.canvas.line(this.points[5].position.x, this.points[5].position.y, this.points[11].position.x, this.points[11].position.y);  
  }
  leftArm(){
    this.canvas.line(this.points[5].position.x, this.points[5].position.y, this.points[7].position.x, this.points[7].position.y);
    this.canvas.line(this.points[7].position.x, this.points[7].position.y, this.points[9].position.x, this.points[9].position.y);
  }
  rightArm(){
    this.canvas.line(this.points[6].position.x, this.points[6].position.y, this.points[8].position.x, this.points[8].position.y);
    this.canvas.line(this.points[8].position.x, this.points[8].position.y, this.points[10].position.x, this.points[10].position.y);
  }
  leftLeg(){
    this.canvas.line(this.points[11].position.x, this.points[11].position.y, this.points[13].position.x, this.points[13].position.y);
    this.canvas.line(this.points[13].position.x, this.points[13].position.y, this.points[15].position.x, this.points[15].position.y);
  }
  rightLeg(){
    this.canvas.line(this.points[12].position.x, this.points[12].position.y, this.points[14].position.x, this.points[14].position.y);
    this.canvas.line(this.points[14].position.x, this.points[14].position.y, this.points[16].position.x, this.points[16].position.y);
  }
}
