let numStrings = 6;
let stringLength = 200;
let numSegments = 20;
let gravity = 0.7;
let simulationSpeed = 2.0;

let center = { x: 300, y: 200 };
let outerPoints = [];
let nodes = [];
let velocities = [];
let dragging = {center: false, indexes: Array(numStrings).fill(false)};
let dragRadius = 16;

let endpointImg;

function preload() {
  endpointImg = loadImage('Image 1.png', 
    () => console.log("Image loaded successfully"), 
    () => console.error("Error loading image")
  );
}


function setup() {
  createCanvas(600, 400);
  center = { x: width/2, y: height/2 };
  for (let i = 0; i < numStrings; i++) {
    let px = center.x + random(-150,150);
    let py = center.y + random(-120,120);
    outerPoints[i] = { x: px, y: py };
  }
  nodes = [];
  velocities = [];
  for (let i = 0; i < numStrings; i++) {
    let ns = [], vs = [];
    for (let j = 0; j <= numSegments; j++) {
      let t = j / numSegments;
      ns.push(createVector(lerp(center.x, outerPoints[i].x, t), lerp(center.y, outerPoints[i].y, t)));
      vs.push(createVector(0,0));
    }
    nodes.push(ns);
    velocities.push(vs);
  }
}

function draw() {
  background(242);
  for (let k = 0; k < numStrings; k++) {
    for (let step = 0; step < simulationSpeed; step++) {
      for (let i = 1; i < numSegments; i++) velocities[k][i].y += gravity / simulationSpeed;
      let targetLength = stringLength / numSegments;
      for (let n = 0; n < 4; n++) {
        for (let i = 0; i < numSegments; i++) {
          let a = nodes[k][i],  b = nodes[k][i+1], delta = p5.Vector.sub(b,a);
          let dist = delta.mag(), diff = (dist - targetLength) / dist;
          if (i !== 0) a.add(delta.copy().mult(diff*0.5));
          if (i !== numSegments-1) b.sub(delta.copy().mult(diff*0.5));
        }
        nodes[k][0].x = center.x; nodes[k][0].y = center.y;
        nodes[k][numSegments].x = outerPoints[k].x; nodes[k][numSegments].y = outerPoints[k].y;
      }
      for (let i = 1; i < numSegments; i++) {
        nodes[k][i].add(p5.Vector.mult(velocities[k][i], 1/simulationSpeed));
        velocities[k][i].mult(0.98);
      }
    }
    // Draw string
    stroke(0); strokeWeight(3); noFill();
    beginShape();
    for (let i = 0; i <= numSegments; i++) vertex(nodes[k][i].x, nodes[k][i].y);
    endShape();
    // Draw outer handle with image
    drawHandle(outerPoints[k].x, outerPoints[k].y, dragging.indexes[k], false);
  }
  // Draw central handle
  drawHandle(center.x, center.y, dragging.center, true);
}

function drawHandle(x, y, isDrag, isCenter=false) {
  if (isCenter) {
    fill(isDrag ? "orange" : "blue");
    noStroke();
    ellipse(x, y, dragRadius*2, dragRadius*2);
  } else {
    // Draw image centered
    imageMode(CENTER);
    image(endpointImg, x, y, dragRadius*2, dragRadius*2); // Adjust size as needed
  }
}

function mousePressed() {
  if (dist(mouseX, mouseY, center.x, center.y) < dragRadius) {
    dragging.center = true;
  } else {
    for (let i = 0; i < numStrings; i++) {
      if (dist(mouseX, mouseY, outerPoints[i].x, outerPoints[i].y) < dragRadius) {
        dragging.indexes[i] = true;
        break;
      }
    }
  }
}
function mouseDragged() {
  if (dragging.center) {
    center.x = constrain(mouseX, 0, width);
    center.y = constrain(mouseY, 0, height);
  }
  for (let i = 0; i < numStrings; i++) {
    if (dragging.indexes[i]) {
      outerPoints[i].x = constrain(mouseX, 0, width);
      outerPoints[i].y = constrain(mouseY, 0, height);
    }
  }
}
function mouseReleased() {
  dragging.center = false;
  for (let i = 0; i < numStrings; i++) dragging.indexes[i] = false;
}
