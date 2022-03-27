import BigBoundingBox from "./BigBoundingBox.js";

export default class Checkpoint extends BigBoundingBox {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene, 0, 3);
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
      position: this.box.position.add(new BABYLON.Vector3(0, 1, 0)),
      orientation: this.scene.player.orientation,
      cameraAlpha: this.scene.camera.alpha,
    };
  }
}
