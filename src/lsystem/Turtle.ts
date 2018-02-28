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

  turtle: TurtleState;

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
    this.turtle = new TurtleState(vec3.create(), vec3.create(), 0);
    this.turtleIndices = [];
    this.turtleNormals = [];
    this.turtlePositions = [];
    this.constructBaseINP();
  }

  applyMatrix(plant: Plant, transform: mat4) {
    let turtleIdx = this.turtleIndices.length;
    let plantIdxLength = plant.plantIndices.length;
    let idxNum = plant.plantIndices[plantIdxLength - 1];
    for (let i = 0; i < turtleIdx; i++) {
      let j = this.turtleIndices[i] + idxNum + 1;
      plant.plantIndices.push(j);
    }
    // TODO: transform normals properly with inversetranspose
    plant.plantNormals = plant.plantNormals.concat(this.turtleNormals);

    // transform normals according to matrix and append
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

  draw(plant: Plant, string: string) {
    for (let x = 0; x < string.length; x++) {
      let currChar = string.charAt(x);
      if (currChar == "A") {

      }
    }
    plant.plantIndices = plant.plantIndices.concat(this.turtleIndices);
    plant.plantNormals = plant.plantNormals.concat(this.turtleNormals);
    plant.plantPositions = plant.plantPositions.concat(this.turtlePositions);

    let transform : mat4 = mat4.create();
    let translate : vec3 = vec3.fromValues(0,2,0);
    
    mat4.fromTranslation(transform, translate);
    let plantIdxLength = this.turtleIndices.length;
    let idxNum = this.turtleIndices[plantIdxLength - 1];
    for (let i = 0; i < plantIdxLength; i++) {
      let j = this.turtleIndices[i] + idxNum + 1;
      plant.plantIndices.push(j);
    }
    plant.plantNormals = plant.plantNormals.concat(this.turtleNormals);
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

    mat4.fromTranslation(transform, vec3.fromValues(2,2,0));
    this.applyMatrix(plant, transform);
    mat4.fromTranslation(transform, vec3.fromValues(0,2,2));
    this.applyMatrix(plant, transform);
    
  }

};

export default Turtle;
