export default class Simple {
  static builder;

  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics();
  }

  initInstance(pX, pY, pZ) {
    if (!Simple.builder) {
      Simple.builder = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        width: 1,
        depth: 1,
      });
      Simple.builder.name = `simple_${pX}_${pY}_${pZ}`;
      Simple.builder.alwaysSelectAsActiveMesh = true;

      Simple.builder.material = new BABYLON.GradientMaterial("grad", this.scene.scene);
      Simple.builder.material.topColor = new BABYLON.Color3(0, 0, 1);
      Simple.builder.material.bottomColor = new BABYLON.Color3(0, 0, 0);
      Simple.builder.material.offset = 0.4;

      Simple.builder.material.disableLighting = true;

      this.box = Simple.builder;
    } else {
      this.box = Simple.builder.createInstance(`simple_${pX}_${pY}_${pZ}`);
    }
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);
  }

  setPhysics() {
    this.box.checkCollisions = true;
    this.box.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene.scene
    );
  }
}
