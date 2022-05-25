export default class DecreaseSpeed {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    if (DecreaseSpeed.builder && DecreaseSpeed.builder._scene != this.scene.scene) {
      DecreaseSpeed.builder.dispose();
      DecreaseSpeed.builder = undefined;
    }

    if (!DecreaseSpeed.builder) {
      DecreaseSpeed.builder = BABYLON.MeshBuilder.CreateTorus("torus", { thickness: 0.25, diameter: 2 });

      DecreaseSpeed.builder.rotation.z = Math.PI / 2;

      DecreaseSpeed.builder.name = `DecreaseSpeed_${pX}_${pY}_${pZ}`;

      DecreaseSpeed.builder.material = this.scene.assetsManager.Materials["Decrease Speed #NJXV5A#19"];

      this.box = DecreaseSpeed.builder;
    } else {
      this.box = DecreaseSpeed.builder.createInstance(`DecreaseSpeed_${pX}_${pY}_${pZ}`);
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
    if (!this.scene.player.slowed) {
      if (this.scene.player.accelerated) {
        this.scene.player.accelerated = false;
      } else {
        this.scene.player.slowed = true;
      }
      this.scene.player.maxSpeed -= 10;
      this.scene.player.jumpHeight -= 2;

      BABYLON.ParticleHelper.ParseFromFileAsync(
        "DecreaseSpeed",
        "../../assets/particles/decreaseSpeed.json",
        this.scene.scene
      ).then((sys) => (sys.emitter = this.box));

      this.scene.assetsManager.Audio["decreaseSpeed"].play();
    }
  }
}
