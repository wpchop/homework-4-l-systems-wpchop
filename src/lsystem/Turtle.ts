import {vec3, mat4} from 'gl-matrix';
class Turtle {
  position: vec3 = vec3.create();
  orientation: vec3 = vec3.create();
  depth: number;

  constructor(position: vec3, orientation: vec3, depth: number) {
      this.position = position;
      this.orientation = orientation;
      this.depth = depth;
  }

};

export default Turtle;
