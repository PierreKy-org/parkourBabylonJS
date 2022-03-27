import Box from "./Box.js";

export default class BigBoundingBox extends Box {
  constructor(pX, pY, pZ, scene, min, max) {
    super(pX, pY, pZ, scene);
    this.initBoundingBox(min, max);
  }

  initBoundingBox(min, max) {
    this.box.setBoundingInfo(
      new BABYLON.BoundingInfo(
        BABYLON.Vector3.Minimize(this.box.getBoundingInfo().boundingBox.minimum, new BABYLON.Vector3(0, min, 0)),
        BABYLON.Vector3.Maximize(this.box.getBoundingInfo().boundingBox.maximum, new BABYLON.Vector3(0, max, 0))
      )
    );

    this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
          parameter: {
            mesh: this.scene.player.mesh,
          },
        },
        () => this.onPlayerCollision()
      )
    );
  }
}
