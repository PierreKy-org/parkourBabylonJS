import Box from "./Box.js";

export default class Simple extends Box {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial(
      "materialHead",
      this.scene.scene
    );
    this.box.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    this.box.showBoundingBox = true;

    //this.scene.camera.lockedTarget = this.box;

    this.initBoundingBox();
  }
}
