import BigBoundingBox from "./BigBoundingBox.js";

export default class Rotator extends BigBoundingBox {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial("material", this.scene.scene);
    this.box.material.emissiveColor = new BABYLON.Color3(0, 0.8, 0.2);
    this.box.showBoundingBox = true;

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
  }

  initBoundingBox() {
    this.box.setBoundingInfo(
      new BABYLON.BoundingInfo(
        BABYLON.Vector3.Minimize(this.box.getBoundingInfo().boundingBox.minimum, new BABYLON.Vector3(0, -100, 0)),
        BABYLON.Vector3.Maximize(this.box.getBoundingInfo().boundingBox.maximum, new BABYLON.Vector3(0, 100, 0))
      )
    );

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
    //Tourne le joueur de la camera de 90°
    this.scene.player.angle = (this.scene.player.mesh.rotationQuaternion.y + 90) % 360;
    this.scene.player.mesh.rotationQuaternion.y = this.scene.player.angle;
    this.scene.camera.startRotationAnimation();

    //Conserve la vitesse et l'acceleration mais change la direction
    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(av.z, 0, av.x));
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-al.z, al.y, -al.x));
  }
}
