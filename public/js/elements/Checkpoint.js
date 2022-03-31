export default class Checkpoint {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initBuilder();

    this.box = Checkpoint.builder.createInstance(`box_${pX}_${pY}_${pZ}`);
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);

    this.setPhysics();
  }

  initBuilder() {
    if (!Checkpoint.builder) {
      Checkpoint.builder = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        width: 1,
        depth: 1,
      });

      Checkpoint.builder.alwaysSelectAsActiveMesh = true;

      Checkpoint.builder.material = new BABYLON.StandardMaterial("simpleMaterial");
      Checkpoint.builder.material.disableLighting = true;
      Checkpoint.builder.material.emissiveColor = BABYLON.Color3.White();
      Checkpoint.builder.material.diffuseTexture = new BABYLON.Texture("../assets/checkboard.jpg", this.scene.scene);

      Checkpoint.builder.registerInstancedBuffer("color", 3);
      Checkpoint.builder.instancedBuffers.color = new BABYLON.Color3(1, 1, 1);
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

    this.box.showBoundingBox = true;
    this.box.setBoundingInfo(
      new BABYLON.BoundingInfo(
        BABYLON.Vector3.Minimize(this.box.getBoundingInfo().boundingBox.minimum, new BABYLON.Vector3(0, 0, 0)),
        BABYLON.Vector3.Maximize(this.box.getBoundingInfo().boundingBox.maximum, new BABYLON.Vector3(0, 3, 0))
      )
    );
  }

  onPlayerCollision() {
    this.scene.player.lastCheckPointData = {
      position: this.box.position.add(new BABYLON.Vector3(0, 1, 0)),
      orientation: this.scene.player.orientation,
      cameraAlpha: this.scene.camera.alpha,
    };
  }
}
