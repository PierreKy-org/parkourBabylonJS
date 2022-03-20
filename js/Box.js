export default class Box {
  constructor(pX, pY, pZ) {
    this.box = BABYLON.MeshBuilder.CreateBox(`box_${pX}_${pY}_${pZ}`, { height: 1, width: 1, depth: 1 });
    this.box.position = new BABYLON.Vector3(pY, pX, pZ);
    this.box.checkCollisions = true;

    this.box.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene
    );

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

    this.box.material = new BABYLON.StandardMaterial("myMaterial", this.scene);
  }
}
