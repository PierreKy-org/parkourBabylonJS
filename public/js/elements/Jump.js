export default class Jump {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics(pX, pY, pZ);
  }

  initInstance(pX, pY, pZ) {
    if (Jump.builder && Jump.builder._scene != this.scene.scene) {
      Jump.builder.dispose();
      Jump.builder = undefined;
    }

    if (!Jump.builder) {
      Jump.builder = this.createModel();
      Jump.builder.name = `jump_${pX}_${pY}_${pZ}`;

      this.box = Jump.builder;
    } else {
      this.box = Jump.builder.createInstance(`jump_${pX}_${pY}_${pZ}`);
      this.scene.assetsManager.Models["trampoline"].meshes.forEach((mesh) => {
        let instance = mesh.createInstance(mesh.name);
        instance.parent = this.box;
      });
    }
    this.box.alwaysSelectAsActiveMesh = true;
    this.box.position = new BABYLON.Vector3(pX, pY - 0.21, pZ);
  }

  createModel() {
    let disc = BABYLON.MeshBuilder.CreateDisc("jump", { radius: 0.4 });
    disc.rotation.x = Math.PI / 2;

    this.scene.assetsManager.Models["trampoline"].meshes.forEach((mesh) => {
      mesh.parent = disc;
      mesh.scaling = new BABYLON.Vector3(0.009, 0.009, 0.009);
      mesh.rotation.x = (3 * Math.PI) / 2;
      mesh.position.z = 0.28;
      mesh.setEnabled(true);
    });

    disc.material = new BABYLON.GridMaterial("jump_material", this.scene.scene);
    disc.material.majorUnitFrequency = 0;
    disc.material.minorUnitVisibility = 0.45;
    disc.material.gridRatio = 0.05;
    disc.material.backFaceCulling = false;
    disc.material.mainColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    disc.material.lineColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    return disc;
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
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(al.x, 13, al.z));
    this.scene.assetsManager.Audio["bounce"].play();
  }
}
