import Box from "./Box.js";

export default class Jump extends Box {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial("material", this.scene.scene);
    this.box.material.emissiveColor = new BABYLON.Color3(0, 0.2, 0.8);

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);

    this.initBoundingBox();
  }

  initBoundingBox() {
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
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(al.x, 10, al.z));
  }
}
