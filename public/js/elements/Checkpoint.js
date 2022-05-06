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
      Checkpoint.builder = this.createModel();
      Checkpoint.builder.name = `checkpoint_${pX}_${pY}_${pZ}`;

      this.box = Checkpoint.builder;
    } else {
      this.box = Checkpoint.builder.createInstance(`checkpoint_${pX}_${pY}_${pZ}`);
      this.flag = this.scene.assetsManager.Assets["flag"].meshes[1].createInstance("Flag");
      this.flag.parent = this.box;
    }
    this.box.alwaysSelectAsActiveMesh = true;
    this.box.position = new BABYLON.Vector3(pX, pY - 0.49, pZ);

    if (!this.scene.player.lastCheckPointData) {
      this.onPlayerCollision();
    }
  }

  createModel() {
    let pole = this.scene.assetsManager.Assets["flag"].meshes[0];
    this.flag = this.scene.assetsManager.Assets["flag"].meshes[1];
    this.flag.parent = pole;
    this.flag.material.backFaceCulling = false;
    this.flag.material.emissiveColor = new BABYLON.Color3.White();
    this.flag.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    this.flag.position.y = -20;

    pole.scaling = new BABYLON.Vector3(0.07, 0.07, 0.07);
    pole.rotation.y = Math.PI / 2;

    return pole;
  }

  setPhysics() {
    this.box.checkCollisions = true;

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
  }

  onPlayerCollision() {
    if (!this.collided) {
      BABYLON.Animation.CreateAndStartAnimation(
        `${this.box.name}_flagUp`,
        this.flag,
        "position.y",
        0.8,
        1,
        -20,
        0,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      this.collided = true;
    }

    if (this.scene.player.lastCheckPointData?.checkpoint != this) {
      BABYLON.Animation.CreateAndStartAnimation(
        `${this.box.name}_flagRotate`,
        this.flag,
        "rotation.y",
        0.8,
        1,
        0,
        BABYLON.Tools.ToRadians(360 * 2),
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    }

    this.scene.player.lastCheckPointData = {
      checkpoint: this,
      position: this.box.position.add(new BABYLON.Vector3(0, 0.3, 0)),
      orientation: this.scene.player.orientation || "front",
      cameraAlpha: this.scene.camera.alpha,
    };
  }
}
