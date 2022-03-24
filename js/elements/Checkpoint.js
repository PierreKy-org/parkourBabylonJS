import BigBoundingBox from "./BigBoundingBox.js";

export default class Checkpoint extends BigBoundingBox {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial("material", this.scene.scene);
    this.box.material.emissiveColor = new BABYLON.Color3(0, 0.5, 0.2);
    this.box.showBoundingBox = true;

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 0, 1);
  }

  //@Override
  onPlayerCollision() {
    this.scene.player.lastCheckPointData = {
      position: this.scene.player.mesh.position,
      orientation: this.scene.player.angle,
      cameraAlpha: this.scene.camera.alpha,
    };
  }
}
