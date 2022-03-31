export default class Jump {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initBuilder();

    this.box = Jump.builder.createInstance(`box_${pX}_${pY}_${pZ}`);
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);

    this.setPhysics();
  }

  initBuilder() {
    if (!Jump.builder) {
      Jump.builder = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        width: 1,
        depth: 1,
      });

      Jump.builder.alwaysSelectAsActiveMesh = true;

      Jump.builder.material = new BABYLON.StandardMaterial("simpleMaterial");
      Jump.builder.material.disableLighting = true;
      Jump.builder.material.emissiveColor = BABYLON.Color3.White();
      Jump.builder.material.diffuseTexture = new BABYLON.Texture("../assets/grass.jpg", this.scene.scene);

      Jump.builder.registerInstancedBuffer("color", 3);
      Jump.builder.instancedBuffers.color = new BABYLON.Color3(1, 1, 1);
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
  }

  onPlayerCollision() {
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(al.x, 10, al.z));
  }
}
