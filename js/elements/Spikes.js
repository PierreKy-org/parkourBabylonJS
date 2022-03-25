import Box from "./Box.js";

export default class Spikes extends Box {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    //This is the spikes of the block
    this.cone = BABYLON.MeshBuilder.CreateCylinder(
      "cone",
      { diameterTop: 0, height: 1, tessellation: 96, diameter: 0.4 },
      this.scene.scene
    );
    this.cone1 = BABYLON.MeshBuilder.CreateCylinder(
      "cone",
      { diameterTop: 0, height: 1, tessellation: 96, diameter: 0.4 },
      this.scene.scene
    );
    this.cone2 = BABYLON.MeshBuilder.CreateCylinder(
      "cone",
      { diameterTop: 0, height: 1, tessellation: 96, diameter: 0.4 },
      this.scene.scene
    );
    this.cone.position.y = this.box.position.y + 0.5;
    this.cone.position.x = this.box.position.x;
    this.cone1.position.y = this.box.position.y + 0.5;
    this.cone1.position.x = this.box.position.x + 0.3;
    this.cone2.position.y = this.box.position.y + 0.5;
    this.cone2.position.x = this.box.position.x - 0.3;

    //This is the merge between box and spikes
    this.box = BABYLON.Mesh.MergeMeshes([
      this.box,
      this.cone,
      this.cone1,
      this.cone2,
    ]);
    this.box.checkCollisions = true;
    this.box.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene.scene
    );
    this.box.material = new BABYLON.StandardMaterial(
      "material",
      this.scene.scene
    );
    this.box.material.emissiveColor = new BABYLON.Color3(0.8, 0.2, 0);
    this.box.showBoundingBox = true;

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
    
    //Enable boundingbox of the merge block
    this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.initBoundingBox();
  }

  initBoundingBox() {
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
    this.scene.player.mesh.position = this.scene.player.lastCheckPointData.position;
    this.scene.player.orientation = this.scene.player.lastCheckPointData.orientation;
    this.scene.player.speed = 0;
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    this.scene.player.resetRotation();
    this.scene.camera.alpha = this.scene.player.lastCheckPointData.cameraAlpha;
    
  }
}
