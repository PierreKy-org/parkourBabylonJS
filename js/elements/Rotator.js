import BigBoundingBox from "./BigBoundingBox.js";

export { RotatorFR, RotatorFL, RotatorBR, RotatorBL, RotatorLF, RotatorLB, RotatorRF, RotatorRB };
class Rotator extends BigBoundingBox {
  constructor(pX, pY, pZ, scene) {
    super(pX, pY, pZ, scene);
    this.box.material = new BABYLON.StandardMaterial("material", this.scene.scene);
    this.box.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    this.box.material.diffuseTexture = new BABYLON.Texture("../assets/arrow.png", this.scene.scene);
    this.box.showBoundingBox = true;

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
  }
}

class RotatorFR extends Rotator {
  onPlayerCollision() {
    console.log("RotatorFR");
    this.scene.player.orientation = "right";
    BABYLON.Animation.CreateAndStartAnimation(
      "rotateFR",
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(270),
      BABYLON.Tools.ToRadians(180),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(av.z, 0, av.x));
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-al.z, al.y, -al.x));
  }
}

class RotatorFL extends Rotator {
  onPlayerCollision() {
    console.log("RotatorFL");
    console.log(BABYLON.Tools.ToDegrees(this.scene.camera.alpha));
    this.scene.player.orientation = "left";
    BABYLON.Animation.CreateAndStartAnimation(
      "rotateFL",
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(270),
      BABYLON.Tools.ToRadians(360),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(av.z, 0, av.x));
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-al.z, al.y, al.x));
  }
}

class RotatorBR extends Rotator {
  onPlayerCollision() {}
}

class RotatorBL extends Rotator {
  onPlayerCollision() {
    console.log("RotatorBL");
    this.scene.player.orientation = "right";
    BABYLON.Animation.CreateAndStartAnimation(
      "rotateBL",
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(90),
      BABYLON.Tools.ToRadians(180),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(av.z, 0, av.x));
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-al.z, al.y, al.x));
  }
}

class RotatorRF extends Rotator {
  onPlayerCollision() {
    console.log("RotatorRF");
    this.scene.player.orientation = "front";
    BABYLON.Animation.CreateAndStartAnimation(
      "rotateRF",
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(180),
      BABYLON.Tools.ToRadians(270),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(av.z, 0, av.x));
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-al.z, al.y, al.x));
  }
}

class RotatorRB extends Rotator {
  onPlayerCollision() {}
}

class RotatorLF extends Rotator {
  onPlayerCollision() {}
}

class RotatorLB extends Rotator {
  onPlayerCollision() {
    console.log("RotatorLB");
    this.scene.player.orientation = "back";
    BABYLON.Animation.CreateAndStartAnimation(
      "rotateLB",
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(0),
      BABYLON.Tools.ToRadians(90),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(av.z, 0, av.x));
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-al.z, al.y, al.x));
  }
}
