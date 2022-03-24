export default class Box {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.box = BABYLON.MeshBuilder.CreateBox(`box_${pX}_${pY}_${pZ}`, {
      height: 1,
      width: 1,
      depth: 1,
    });
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);
    this.box.checkCollisions = true;

    this.box.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene.scene
    );

    this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);

    this.initBoundingBox();
  }

  initBoundingBox() {}

  onPlayerCollision() {}
}
