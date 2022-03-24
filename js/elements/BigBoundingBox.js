import Box from "./Box.js";

export default class BigBoundingBox extends Box {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
  }

  //@Override
  initBoundingBox() {
    this.box.setBoundingInfo(
      new BABYLON.BoundingInfo(
        BABYLON.Vector3.Minimize(
          this.box.getBoundingInfo().boundingBox.minimum,
          new BABYLON.Vector3(0, -100, 0)
        ),
        BABYLON.Vector3.Maximize(
          this.box.getBoundingInfo().boundingBox.maximum,
          new BABYLON.Vector3(0, 100, 0)
        )
      )
    );
  }

}
