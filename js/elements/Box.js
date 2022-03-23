export default class Box {
  constructor(pX, pY, pZ, scene, triggerType = null) {
    this.scene = scene;
    this.box = BABYLON.MeshBuilder.CreateBox(`box_${pX}_${pY}_${pZ}`, {
      height: 1,
      width: 1,
      depth: 1,
    });
    this.box.position = new BABYLON.Vector3(pY, pX, pZ);
    this.box.checkCollisions = true;

    this.box.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene.scene
    );

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

    this.box.material = new BABYLON.StandardMaterial(
      "myMaterial",
      this.scene.scene
    );
  }

  initBoundingBox(triggerType) {
    if (triggerType === null) return;
    else {
      this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
      this.box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: triggerType,
            parameter: {
              mesh: this.scene.player.mesh,
            },
          },
          () => this.onPlayerCollision()
        )
      );
    }
  }

  onPlayerCollision() {}
}
