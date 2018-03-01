import {vec3, vec4, mat4} from 'gl-matrix';
import Plant from '../geometry/Plant';

class TurtleState {
  position: vec3 = vec3.create();
  orientation: vec3 = vec3.create();
  depth: number;

  constructor(position: vec3, orientation: vec3, depth: number) {
    this.position = position;
    this.orientation = orientation;
    this.depth = depth;
  }

}

export class Turtle {

  turtleIndices: number [];
  turtleNormals: number [];
  turtlePositions: number [];

  translate: mat4;
  rotate: mat4;
  scale: mat4;

  turtleStack: TurtleState [];
  turtleState: TurtleState;

  constructBaseINP() {
    this.turtleIndices.push(0, 1, 2,
      0, 2, 3,
      4, 5, 6,
      4, 6, 7,
      8, 9, 10,
      8, 10, 11,
      12, 13, 14,
      12, 14, 15,
      16, 17, 18,
      16, 18, 19,
      20, 21, 22,
      20, 22, 23);
    this.turtleNormals.push(0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, -1, 0,
      0, 0, -1, 0,
      0, 0, -1, 0,
      0, 0, -1, 0,
      1, 0, 0, 0,
      1, 0, 0, 0,
      1, 0, 0, 0,
      1, 0, 0, 0,
      -1, 0, 0, 0,
      -1, 0, 0, 0,
      -1, 0, 0, 0,
      -1, 0, 0, 0,
      0, 1, 0, 0,
      0, 1, 0, 0,
      0, 1, 0, 0,
      0, 1, 0, 0,
      0, -1, 0, 0,
      0, -1, 0, 0,
      0, -1, 0, 0,
      0, -1, 0, 0);
    this.turtlePositions.push(
      // front
      -1, -1, 1, 1,
      1, -1, 1, 1,
      1, 1, 1, 1,
      -1, 1, 1, 1,
      // back
      -1, -1, -1, 1,
      1, -1, -1, 1,
      1, 1, -1, 1,
      -1, 1, -1, 1,
      // right
      1, -1, -1, 1,
      1, 1, -1, 1,
      1, 1, 1, 1,
      1, -1, 1, 1,
      // left                                     
      -1, -1, -1, 1,
      -1, 1, -1, 1,
      -1, 1, 1, 1,
      -1, -1, 1, 1,
      // top
      -1, 1, -1, 1,
      1, 1, -1, 1,
      1, 1, 1, 1,
      -1, 1, 1, 1,
      // bottom
      -1, -1, -1, 1,
      1, -1, -1, 1,
      1, -1, 1, 1,
      -1, -1, 1, 1
    );
  }

  constructor() {
    this.turtleIndices = [];
    this.turtleNormals = [];
    this.turtlePositions = [];
    this.constructBaseINP();

    this.translate = mat4.create();
    this.rotate = mat4.create();
    this.scale = mat4.create();

    this.turtleStack = [];
    this.turtleStack.push(new TurtleState(vec3.create(), vec3.create(), 0));

    this.turtleState = this.turtleStack[this.turtleStack.length - 1];

  }

  applyMatrix(plant: Plant, transform: mat4) {
    let turtleIdx = this.turtleIndices.length;
    let plantIdxLength = plant.plantIndices.length;
    let idxNum = plant.plantIndices[plantIdxLength - 1];
    if (plantIdxLength === 0) {
      idxNum = -1;
    }
    for (let i = 0; i < turtleIdx; i++) {
      let j = this.turtleIndices[i] + idxNum + 1;
      plant.plantIndices.push(j);
    }

    let invTransT = mat4.create();
    mat4.transpose(invTransT, transform);
    mat4.invert(invTransT, invTransT);

    // transform normals and append
    for (let i = 0; i < this.turtleNormals.length - 1; i+=4) {
      let x = this.turtleNormals[i];
      let y = this.turtleNormals[i + 1];
      let z = this.turtleNormals[i + 2];
      let w = this.turtleNormals[i + 3];
      let nor = vec4.fromValues(x, y, z, w);
      vec4.transformMat4(nor, nor, invTransT);
      plant.plantNormals.push(nor[0]);
      plant.plantNormals.push(nor[1]);
      plant.plantNormals.push(nor[2]);
      plant.plantNormals.push(nor[3]);
    }

    // transform positions according to matrix and append
    for (let i = 0; i < this.turtlePositions.length - 1; i+=4) {
      let x = this.turtlePositions[i];
      let y = this.turtlePositions[i + 1];
      let z = this.turtlePositions[i + 2];
      let w = this.turtlePositions[i + 3];
      let pos = vec4.fromValues(x, y, z, w);
      vec4.transformMat4(pos, pos, transform);
      plant.plantPositions.push(pos[0]);
      plant.plantPositions.push(pos[1]);
      plant.plantPositions.push(pos[2]);
      plant.plantPositions.push(pos[3]);
    }
  }

  getMatrix() {
    let transform : mat4 = mat4.create();

    let localTranslate : mat4 = mat4.create();
    mat4.fromTranslation(localTranslate, [0,1,0]);
    // mat4.multiply(transform, transform, localTranslate);

    mat4.fromScaling(this.scale, vec3.fromValues(0.05,0.5,0.05));
    mat4.fromRotation(this.rotate, 45 * Math.PI / 180, this.turtleState.orientation);
    mat4.fromTranslation(this.translate, this.turtleState.position);
    mat4.multiply(transform, this.translate, this.rotate);
    mat4.multiply(transform, transform, this.scale);

    return transform;
  }

  drawBinaryTree(plant: Plant, string: string) {

  }

  // after drawing a branch, update the turtlestate
  updateTurtlePosition(localPos : vec4) {
    // vec4.transformMat4(localPos, localPos, this.getMatrix());
    this.getMatrix();
    vec4.transformMat4(localPos, localPos, this.rotate);
    let worldPos = this.turtleState.position;
    vec4.add(localPos, localPos, [worldPos[0], worldPos[1], worldPos[2]]);
    this.turtleStack[this.turtleStack.length - 1].position = 
      vec3.fromValues(localPos[0], localPos[1], localPos[2]);
  }

  draw(plant: Plant, string: string) {
    for (let x = 0; x < string.length; x++) {
      let currChar = string.charAt(x);
      if (currChar == "A") {
        let transformLocal = mat4.create();
        mat4.fromTranslation(transformLocal,[0,1,0]);

        let transform = this.getMatrix();
        mat4.multiply(transform, transform, transformLocal);
        this.applyMatrix(plant, transform);
        // update turtlestate position
        let pos = vec4.fromValues(0,1,0,1);
        this.updateTurtlePosition(pos);
        
      } else if (currChar == "B") {
        let transformLocal = mat4.create();
        mat4.fromTranslation(transformLocal,[0,1,0]);

        let transform = this.getMatrix();
        mat4.multiply(transform, transform, transformLocal);
        this.applyMatrix(plant, transform);
        let pos = vec4.fromValues(0,1,0,1);
        this.updateTurtlePosition(pos);
      } else if (currChar == "[") {
        let pos = this.turtleState.position;
        let depth = this.turtleState.depth + 1;
        let orientation = this.turtleStack[this.turtleStack.length - 1].orientation
        vec3.add(orientation, orientation, [0,0,1]);
        let turt = new TurtleState(pos, orientation, depth);
        this.turtleStack.push(turt);
      } else if (currChar == "]") {
        this.turtleStack.pop();
        let orientation = this.turtleStack[this.turtleStack.length - 1].orientation
        vec3.add(orientation, orientation, [0,0,-2]);
        this.turtleStack[this.turtleStack.length - 1].orientation = orientation;
      }
    }
  }

};

export default Turtle;
