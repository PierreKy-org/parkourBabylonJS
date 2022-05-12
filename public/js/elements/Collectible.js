export default class Collectible {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    if (Collectible.model && Collectible.model.meshes[0]._scene != this.scene.scene) {
      Collectible.model.meshes[0].dispose();
      Collectible.model = undefined;
    }

    if (!Collectible.model) {
      Collectible.model = this.scene.assetsManager.Models["pumpkin"];
      Collectible.model.meshes[0].name = "collectible model";

      Collectible.model.meshes[1].outlineWidth = 0.1;
      Collectible.model.meshes[1].outlineColor = BABYLON.Color3.White();
    }
    this.mesh = Collectible.model.meshes[1].createInstance(`collectible_${pX}_${pY}_${pZ}`);
    this.mesh.alwaysSelectAsActiveMesh = true;
    this.mesh.position = new BABYLON.Vector3(pX, pY, pZ);
    this.mesh.isPickable = false;
    this.scene.collectable += 1;
    this.setPhysics();
    this.startAnimation();
  }

  setPhysics() {
    this.mesh.checkCollisions = true;
    this.mesh.rotationQuaternion = null;

    this.mesh.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.mesh.actionManager.registerAction(
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

  startAnimation() {
    const rotate = new BABYLON.Animation(
      "wheelAnimation",
      "rotation.y",
      5,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    rotate.setKeys([
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 30,
        value: 2 * Math.PI,
      },
    ]);

    this.mesh.animations = [rotate];
    this.scene.scene.beginAnimation(this.mesh, 0, 30, true);
  }

  async onPlayerCollision() {
    this.scene.assetsManager.Audio["collected"].setVolume(0.4);
    this.scene.assetsManager.Audio["collected"].play();
    BABYLON.ParticleHelper.ParseFromFileAsync(
      "collected",
      "../../assets/particles/collected.json",
      this.scene.scene
    ).then((sys) => (sys.emitter = this.mesh.position));
    this.mesh.dispose();
    this.scene.collected += 1;
  }
}
