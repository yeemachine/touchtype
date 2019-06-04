//Uses PoseNet

let poseNet,bodyNet,bodyNetImage,imageElement
let lerpPoses = [];
let options = { 
  flipHorizontal: false,
  decodingMethod: 'multi-person',
  maxPoseDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20
}

const poseNetRun = () => {
  if(imageElement){
    console.log(poseNet)
    poseNet.estimatePoses(imageElement, options)
    .then(function(poses){ 
    poseCapture(poses)
  }) 
    window.requestAnimationFrame(poseNetRun);
  }else{
    window.requestAnimationFrame(poseNetRun);
  }

}

// const Uint8ToBase64 = u8Arr => {
//   var CHUNK_SIZE = 0x8000; //arbitrary number
//   var index = 0;
//   var length = u8Arr.length;
//   var result = '';
//   var slice;
//   while (index < length) {
//     slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length)); 
//     result += String.fromCharCode.apply(null, slice);
//     index += CHUNK_SIZE;
//   }
//   return btoa(result);
// }

// async function bodyNetRun(){
//     let outputStride = 16,
//         segmentationThreshold = 0.6,
//         maskBackground = false;
//     if(imageElement){
//     const personSegmentation = await bodyNet.estimatePartSegmentation(imageElement, outputStride, segmentationThreshold);
//     }
//     requestAnimationFrame(bodyNetRun);
// }

const poseCapture = poses => {
  if(poses.length > 0){
    if(poses.length < lerpPoses.length){
      lerpPoses = lerpPoses.slice(poses.length)
    }
    for (let [i,e] of poses.entries()){
        // console.log('confident')
      if(e.score > 0.25){
        if(lerpPoses[i] === undefined){
          lerpPoses[i] = e
        }else{
          for(let [j,f] of lerpPoses[i].keypoints.entries()){
            let xDif = e.keypoints[j].position.x - f.position.x
            let yDif = e.keypoints[j].position.y - f.position.y

            if(Math.abs(xDif) > 50 || Math.abs(yDif) > 50){
              f.position.x = e.keypoints[j].position.x
              f.position.y = e.keypoints[j].position.y
            }else{
              f.position.x = lerp(f.position.x,e.keypoints[j].position.x,0.5)
              f.position.y = lerp(f.position.y,e.keypoints[j].position.y,0.5)
              f.position.dx = xDif
              f.position.dy = yDif
            }
            f.score = e.keypoints[j].score
          }
        }
      }else{
      }
      
    } 
  }else{
    lerpPoses = []
  }
}

const poseRender = () => {
  if(lerpPoses.length > 0){
    if(!flock.textChange){
      flock.assemble = true
    }
    
    flock.portals = []
    if(lerpPoses[0]){
      let leftWrist = lerpPoses[0].keypoints[10]
      let rightWrist = lerpPoses[0].keypoints[9]
      if(leftWrist.score > 0.01){
        flock.portals.push(createVector(leftWrist.position.x,leftWrist.position.y))
      }
      if(rightWrist.score > 0.01){
        flock.portals.push(createVector(rightWrist.position.x,rightWrist.position.y))
      }   
    }
    
    for(let e of lerpPoses){
      if(e !== undefined){
        if (e.score > 0.25){
          let activePoints = []
          let keypoints = e.keypoints
          let figure = new Figure(keypoints)
          tint(150, 150, 150)
          figure.allPoints()
          figure.allLines()
          image(handR, keypoints[9].position.x - handR.width/2,keypoints[9].position.y - handR.height/2,16,16);
          image(handL, keypoints[10].position.x - handL.width/2,keypoints[10].position.y - handL.height/2,16,16);
        
        }
      }
    }
  }else{
    flock.assemble = false
  }
}

class Figure {
  constructor(keypoints) {
    this.points = keypoints
    this.d = dist(keypoints[0].position.x,keypoints[0].position.y,keypoints[1].position.x,keypoints[1].position.y);
  }
  eyes(){
    ellipse(this.points[1].position.x,this.points[1].position.y,this.d)
    ellipse(this.points[2].position.x,this.points[2].position.y,this.d)
  };
  nose(){        
    ellipse(this.points[0].position.x,this.points[0].position.y,this.d)
  };
  ears(){
    ellipse(this.points[3].position.x,this.points[3].position.y,this.d)
    ellipse(this.points[4].position.x,this.points[4].position.y,this.d)    
  };
  allPoints(){
    for (let e of this.points){
      ellipse(e.position.x,e.position.y,this.d)
    }
  } 
  allLines(){
    stroke(118,0,245);
    strokeWeight(this.d*.3)
    line(this.points[5].position.x, this.points[5].position.y, this.points[6].position.x, this.points[6].position.y);
    line(this.points[11].position.x, this.points[11].position.y, this.points[12].position.x, this.points[12].position.y);  
    line(this.points[6].position.x, this.points[6].position.y, this.points[12].position.x, this.points[12].position.y);   
    line(this.points[5].position.x, this.points[5].position.y, this.points[11].position.x, this.points[11].position.y);  
    line(this.points[5].position.x, this.points[5].position.y, this.points[7].position.x, this.points[7].position.y);
    line(this.points[7].position.x, this.points[7].position.y, this.points[9].position.x, this.points[9].position.y);
    
    line(this.points[6].position.x, this.points[6].position.y, this.points[8].position.x, this.points[8].position.y);
    line(this.points[8].position.x, this.points[8].position.y, this.points[10].position.x, this.points[10].position.y);
    
    line(this.points[11].position.x, this.points[11].position.y, this.points[13].position.x, this.points[13].position.y);
    line(this.points[13].position.x, this.points[13].position.y, this.points[15].position.x, this.points[15].position.y);
    line(this.points[12].position.x, this.points[12].position.y, this.points[14].position.x, this.points[14].position.y);
    line(this.points[14].position.x, this.points[14].position.y, this.points[16].position.x, this.points[16].position.y);
  }
  torso(){
    line(this.points[5].position.x, this.points[5].position.y, this.points[6].position.x, this.points[6].position.y);
    line(this.points[11].position.x, this.points[11].position.y, this.points[12].position.x, this.points[12].position.y);  
    line(this.points[6].position.x, this.points[6].position.y, this.points[12].position.x, this.points[12].position.y);   
    line(this.points[5].position.x, this.points[5].position.y, this.points[11].position.x, this.points[11].position.y);  
  }
  leftArm(){
    line(this.points[5].position.x, this.points[5].position.y, this.points[7].position.x, this.points[7].position.y);
    line(this.points[7].position.x, this.points[7].position.y, this.points[9].position.x, this.points[9].position.y);
  }
  rightArm(){
    line(this.points[6].position.x, this.points[6].position.y, this.points[8].position.x, this.points[8].position.y);
    line(this.points[8].position.x, this.points[8].position.y, this.points[10].position.x, this.points[10].position.y);
  }
  leftLeg(){
    line(this.points[11].position.x, this.points[11].position.y, this.points[13].position.x, this.points[13].position.y);
    line(this.points[13].position.x, this.points[13].position.y, this.points[15].position.x, this.points[15].position.y);
  }
  rightLeg(){
    line(this.points[12].position.x, this.points[12].position.y, this.points[14].position.x, this.points[14].position.y);
    line(this.points[14].position.x, this.points[14].position.y, this.points[16].position.x, this.points[16].position.y);
  }
}

