export default class Checkpoint {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);

    this.setPhysics();
  }

  initInstance(pX, pY, pZ) {
    if (Checkpoint.builder && Checkpoint.builder._scene != this.scene.scene) {
      Checkpoint.builder.dispose();
      Checkpoint.builder = undefined;
    }

    if (!Checkpoint.builder) {
      Checkpoint.builder = BABYLON.MeshBuilder.CreateBox(
        "box",
        {
          height: 1,
          width: 1,
          depth: 1,
        },
        this.scene.scene
      );
      Checkpoint.builder.name = `checkpoint_${pX}_${pY}_${pZ}`;

      Checkpoint.builder.material = new BABYLON.StandardMaterial("simpleMaterial", this.scene.scene);
      Checkpoint.builder.material.disableLighting = true;
      Checkpoint.builder.material.emissiveColor = BABYLON.Color3.White();
      Checkpoint.builder.material.diffuseTexture = new BABYLON.Texture("../assets/checkboard.jpg", this.scene.scene);

      this.box = Checkpoint.builder;
    } else {
      this.box = Checkpoint.builder.createInstance(`checkpoint_${pX}_${pY}_${pZ}`);
    }
    this.box.alwaysSelectAsActiveMesh = true;
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);

    if (!this.scene.player.lastCheckPointData) {
      this.onPlayerCollision();
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
      position: this.box.position.add(new BABYLON.Vector3(0, 0.8, 0)),
      orientation: this.scene.player.orientation,
      cameraAlpha: this.scene.camera.alpha,
    };
  }
}
