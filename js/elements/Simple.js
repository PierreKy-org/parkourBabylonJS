import Box from "./Box.js";

export default class Simple extends Box {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial("material", this.scene.scene);
    this.box.material.emissiveColor = new BABYLON.Color3(0.8, 0.2, 0);

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 0, 1);
    this.initBoundingBox();
  }
}
