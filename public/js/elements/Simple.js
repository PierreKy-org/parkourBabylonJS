export default class Simple {
  static builder;
  static inverted = false;
  static invertThreshold = 20;

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

      BABYLON.NodeMaterial.ParseFromSnippetAsync(
        "#NJXV5A#12",
        this.scene.scene
      ).then((nodeMaterial) => {
        Simple.builder.material = nodeMaterial;
      });

      this.box = Simple.builder;
    } else {
      this.box = Simple.builder.createInstance(`simple_${pX}_${pY}_${pZ}`);
    }
    this.box.alwaysSelectAsActiveMesh = true;
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
