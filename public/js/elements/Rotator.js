export { RotatorFR, RotatorFL, RotatorBR, RotatorBL, RotatorLF, RotatorLB, RotatorRF, RotatorRB };
class Rotator {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initBuilder();

    this.box = Rotator.builder.createInstance(`box_${pX}_${pY}_${pZ}`);
    this.box.position = new BABYLON.Vector3(pX, pY, pZ);

    this.setPhysics();

    this.box.enableEdgesRendering();
    this.box.edgesWidth = 4.0;
    this.box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
  }

  initBuilder() {
    if (!Rotator.builder) {
      Rotator.builder = BABYLON.MeshBuilder.CreateBox("box", {
        height: 1,
        width: 1,
        depth: 1,
      });

      Rotator.builder.alwaysSelectAsActiveMesh = true;

      Rotator.builder.material = new BABYLON.StandardMaterial("simpleMaterial");
      Rotator.builder.material.disableLighting = true;
      Rotator.builder.material.emissiveColor = BABYLON.Color3.White();
      Rotator.builder.material.diffuseTexture = new BABYLON.Texture("../assets/arrow.png", this.scene.scene);

      Rotator.builder.registerInstancedBuffer("color", 3);
      Rotator.builder.instancedBuffers.color = new BABYLON.Color3(1, 1, 1);
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
          trigger: BABYLON.ActionManager.OnIntersectionLeaveTrigger,
          parameter: {
            mesh: this.scene.player.mesh,
          },
        },
        () => this.onPlayerCollision()
      )
    );

    this.box.showBoundingBox = true;
    this.box.setBoundingInfo(
      new BABYLON.BoundingInfo(
        BABYLON.Vector3.Minimize(this.box.getBoundingInfo().boundingBox.minimum, new BABYLON.Vector3(0, 0, 0)),
        BABYLON.Vector3.Maximize(this.box.getBoundingInfo().boundingBox.maximum, new BABYLON.Vector3(0, 10, 0))
      )
    );
  }
}

class RotatorFR extends Rotator {
  onPlayerCollision() {
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
