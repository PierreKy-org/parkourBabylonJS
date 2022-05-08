export default class Simple {
  static builder;

  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  async initInstance(pX, pY, pZ) {
    if (Simple.builder && Simple.builder._scene != this.scene.scene) {
      Simple.builder.dispose();
      Simple.builder = undefined;
    }

    if (!Simple.builder) {
      Simple.builder = BABYLON.MeshBuilder.CreateBox(
        "box",
        {
          height: 1,
          width: 1,
          depth: 1,
        },
        this.scene.scene
      );
      Simple.builder.name = `simple_${pX}_${pY}_${pZ}`;

      Simple.builder.material =
        this.scene.assetsManager.Materials["Simple #NJXV5A#12"];

      this.box = Simple.builder;
    } else {
      this.box = Simple.builder.createInstance(
        `simple_${pX}_${pY}_${pZ}`,
        this.scene.scene
      );
    }
    this.box.alwaysSelectAsActiveMesh = true;
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);

    this.setPhysics();
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
