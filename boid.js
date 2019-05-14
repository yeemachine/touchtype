// Adapted from Daniel Shiffman's Flocking Example
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

let flock, textPoints;
let alignValue=0.2, 
    cohesionValue=0.4, 
    separationValue=0.3;

const createTextPoints = (word) => {
  textFont(font)
  textSize(110)
  let bbox = font.textBounds(word,0,0,110)
  let textPoints = font.textToPoints(word, (width/2 - bbox.w/2), (height/2 + bbox.h/3.5), 110, {sampleFactor:0.09,simplifyThreshold:0});
  return textPoints
}

class Flock {
  constructor(count,words) {
    this.words = words
    this.word = (words[0]) ? words[0] : 'hello'
    this.textChange = false;
    this.assemble = false;
    this.portals = []
    this.textPoints = createTextPoints(this.word)
    this.boids = (()=>{
      let arr = []
      for (let i=0; i<count; i++) {
        arr.push(new Boid(i));
      }
      return arr
    })()
    this.counter = 0
    this.iteration = 0
  }
  changeText(word) {
  this.word = word
  this.textPoints = createTextPoints(this.word)
  }
  arrived(){
  }
  run() {
    if(this.assemble){
      if(this.counter < 1){
        this.counter = this.counter + 0.0025
      }else{
        if (this.iteration < this.words.length-1){
          this.iteration = this.iteration + 1
        }else{
          this.iteration = 0
        }
        this.counter = 0
        this.changeText(this.words[this.iteration]) 
      }
      for (let i=0; i<this.textPoints.length; i++){
        if(this.boids[i]){
          this.boids[i].assemble = true
        }
      }
    }else{
      this.counter = 0
      for (let boid of this.boids) {
        boid.assemble = false
      }
    }
    for (let boid of this.boids) {
      boid.edges();
      boid.run(this.boids);
    }
    document.querySelector('.loader').style.width = this.counter * 100 + '%'
    
  }
}


class Boid {
  constructor(id) {
    this.id = id;
    this.counter = 0;
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    
    this.maxForce = 0.05;
    this.maxSpeed = 3;
    this.target = null;
    this.r = random(2, 4)
    this.assemble = false;
    this.amt = 0
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x <0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  flee(portals){
    if (portals.length > 0){
      for (let target of portals){
        if (target){
          var desired = p5.Vector.sub(target, this.position);
          var d = desired.mag();
          if (d < 50) {
            desired.setMag(this.maxSpeed);
            desired.mult(-1);
            var steer = p5.Vector.sub(desired, this.velocity);
            this.acceleration.add(steer);
          }
        }
       
      }
    }
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignValue);
    cohesion.mult(cohesionValue);
    separation.mult(separationValue);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }
  
  arrive(point){
    this.target = createVector(point.x,point.y);
    let desired = p5.Vector.sub(this.target, this.position), d = desired.mag();

    
    // Scale with arbitrary damping within 100 pixels
    desired.setMag(d < 100 ? map(d,0,100,0,this.maxSpeed) : this.maxSpeed);
    // desired.setMag(this.maxSpeed)

    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    this.acceleration.add(steer);
  }
  
  //update location
  update() {
    if (this.assemble && this.target.dist(this.position) < 0.01) {
      // this.velocity = p5.Vector.fromAngle(this.theta + radians(90));
      // this.point = textPoints[this.id+this.counter]
      // this.theta = p5.Vector.fromAngle(radians(this.point.alpha)).heading()+radians(90);
      // this.target = createVector(this.point.x,this.point.y);
    }
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  render() {
    let theta = this.velocity.heading() + radians(90);
    let from = color(118, 0, 245);
    let to = color(150, 150, 150);
    let fade = lerpColor(from, to, this.amt)
    if(this.assemble){
      if(this.amt<1){
        this.amt = this.amt + 0.005
      }  
    fill(fade);  
    }else{
      if(this.amt>0){
        this.amt = this.amt - 0.005
      }
    fill(fade);
    }
    noStroke();
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r*1);
    vertex(-this.r, this.r*(2-this.amt*2));
    vertex(0, this.r);
    vertex(this.r, this.r*(2-this.amt*2));
    endShape(CLOSE);
    pop(); 
  }
  
  run(boids){
    if (this.assemble) {
      if(flock.textPoints[this.id]){
        this.arrive(flock.textPoints[this.id]);
      }else{
        this.assemble = false
      }
    }
    else {
      this.target = null
      this.flock(boids);
    }
    this.flee(flock.portals)
    this.update();
    this.render(); 
  }
}


