export default class Simple {
  static builder;

  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initBuilder();

    this.box = Simple.builder.createInstance(`box_${pX}_${pY}_${pZ}`);
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);

    this.setPhysics();
  }

  initBuilder() {
    if (!Simple.builder) {
      Simple.builder = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        width: 1,
        depth: 1,
      });

      Simple.builder.alwaysSelectAsActiveMesh = true;

      Simple.builder.material = new BABYLON.StandardMaterial("simpleMaterial");
      Simple.builder.material.disableLighting = true;
      Simple.builder.material.emissiveColor = BABYLON.Color3.White();
      Simple.builder.material.diffuseTexture = new BABYLON.Texture("../assets/brick.png", this.scene.scene);

      Simple.builder.registerInstancedBuffer("color", 3);
      Simple.builder.instancedBuffers.color = new BABYLON.Color3(0.8, 0.8, 0.8);
    }
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
