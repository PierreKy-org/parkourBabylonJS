export default class Collectible {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    if (!Collectible.model || Collectible.builder._scene != this.scene) {
      Collectible.model = this.scene.assetsManager.Assets["pumpkin"];
      Collectible.model.meshes[0].setEnabled(false);
      Collectible.model.meshes[0].name = "collectible model";

      Collectible.model.meshes[1].outlineWidth = 0.1;
      Collectible.model.meshes[1].outlineColor = BABYLON.Color3.White();
    }
    this.mesh = Collectible.model.meshes[1].createInstance(`collectible_${pX}_${pY}_${pZ}`);
    this.mesh.alwaysSelectAsActiveMesh = true;
    this.mesh.position = new BABYLON.Vector3(pX, pY, pZ);
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

  onPlayerCollision() {
    this.mesh.dispose();
    this.scene.collected += 1;
  }
}
