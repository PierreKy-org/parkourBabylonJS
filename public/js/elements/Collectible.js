export default class Collectible {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    BABYLON.SceneLoader.ImportMesh(
      null,
      "https://models.babylonjs.com/Marble/marble/",
      "marble.gltf",
      this.scene.scene,
      (meshes) => {
        meshes[0].position = new BABYLON.Vector3(pX, pY, pZ);
        this.mesh = meshes[0];
        this.setPhysics();
        this.startAnimation();
      }
    );
    //this.box.position = new BABYLON.Vector3(pX, pY, pZ);
  }

  setPhysics() {
    this.mesh.checkCollisions = true;
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.mesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 0 },
      this.scene.scene
    );
    this.mesh.rotationQuaternion = null;

    let radius = 0.3;
    this.mesh.setBoundingInfo(
      new BABYLON.BoundingInfo(
        new BABYLON.Vector3(-radius, -radius, -radius),
        new BABYLON.Vector3(radius, radius, radius)
      )
    );

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
