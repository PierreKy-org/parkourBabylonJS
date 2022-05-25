export default class IncreaseSpeed {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    if (IncreaseSpeed.builder && IncreaseSpeed.builder._scene != this.scene.scene) {
      IncreaseSpeed.builder.dispose();
      IncreaseSpeed.builder = undefined;
    }

    if (!IncreaseSpeed.builder) {
      IncreaseSpeed.builder = BABYLON.MeshBuilder.CreateTorus("torus", { thickness: 0.25, diameter: 2 });

      IncreaseSpeed.builder.rotation.z = Math.PI / 2;

      IncreaseSpeed.builder.name = `increasespeed_${pX}_${pY}_${pZ}`;

      IncreaseSpeed.builder.material = this.scene.assetsManager.Materials["Increase Speed #NJXV5A#17"];

      this.box = IncreaseSpeed.builder;
    } else {
      this.box = IncreaseSpeed.builder.createInstance(`increaseSpeed_${pX}_${pY}_${pZ}`);
    }
    this.box.alwaysSelectAsActiveMesh = true;
    this.box.isPickable = false;
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);
  }

  setPhysics() {
    this.box.checkCollisions = true;

    this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
          parameter: {
            mesh: this.scene.player.mesh,
          },
        },
        () => this.onPlayerCollision()
      )
    );
  }

  onPlayerCollision() {
    if (!this.scene.player.accelerated) {
      if (this.scene.player.slowed) {
        this.scene.player.slowed = false;
      } else {
        this.scene.player.accelerated = true;
      }
      this.scene.player.maxSpeed += 10;
      this.scene.player.jumpHeight += 2;

      if (this.scene.player.speed > 0) {
        this.scene.player.speed = this.scene.player.maxSpeed;
      } else {
        this.scene.player.speed = -this.scene.player.maxSpeed;
      }

      BABYLON.ParticleHelper.ParseFromFileAsync(
        "reducespeed",
        "../../assets/particles/increaseSpeed.json",
        this.scene.scene
      ).then((sys) => (sys.emitter = this.box));

      this.scene.assetsManager.Audio["increaseSpeed"].play();
    }
  }
}
