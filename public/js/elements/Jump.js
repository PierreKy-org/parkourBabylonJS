export default class Jump {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    if (!Jump.builder) {
      Jump.builder = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        width: 1,
        depth: 1,
      });
      Jump.builder.name = `jump_${pX}_${pY}_${pZ}`;

      Jump.builder.material = new BABYLON.GradientMaterial("grad", this.scene.scene);
      Jump.builder.material.topColor = new BABYLON.Color3(1, 1, 1);
      Jump.builder.material.bottomColor = new BABYLON.Color3(0, 0, 0);
      Jump.builder.material.offset = 0.6;

      Jump.builder.material.disableLighting = true;

      this.box = Jump.builder;
    } else {
      this.box = Jump.builder.createInstance(`jump_${pX}_${pY}_${pZ}`);
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
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(al.x, 10, al.z));
  }
}
