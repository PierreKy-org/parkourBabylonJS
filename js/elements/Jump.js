import Box from "./Box.js";

export default class Jump extends Box {
  constructor(pX, pY, pZ, scene, ) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial(
      "materialHead",
      this.scene.scene
    );
    this.box.material.emissiveColor = new BABYLON.Color3(1, 0.33, 0.6);
    this.box.showBoundingBox = true;

    //this.scene.camera.lockedTarget = this.box;

    this.initBoundingBox();
  }

  initBoundingBox() {
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

  onPlayerCollision() {
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(
      new BABYLON.Vector3(al.x, 10, al.z)
    );
  }
}
