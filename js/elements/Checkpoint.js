import BigBoundingBox from "./BigBoundingBox.js";

export default class Checkpoint extends BigBoundingBox {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial(
      "material",
      this.scene.scene
    );
    this.box.material.emissiveColor = new BABYLON.Color3(0, 0.5, 0.2);
    this.box.showBoundingBox = true;

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 0, 1);
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

    this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: {
            mesh: this.scene.player.mesh,
          },
        },
        () => this.onPlayerCollision()
      )
    );
  }

  //@Override
  onPlayerCollision() {
    this.scene.player.lastCheckPoint = [this.scene.player.mesh.position, this.scene.player.angle, this.scene.camera.alpha];
  }
}
