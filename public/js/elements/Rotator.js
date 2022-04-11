export { RotatorFR, RotatorFL, RotatorBR, RotatorBL, RotatorLF, RotatorLB, RotatorRF, RotatorRB };
class Rotator {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics();
  }

  initInstance(pX, pY, pZ) {
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

      this.box = Rotator.builder;
    } else {
      this.box = Rotator.builder.createInstance(`box_${pX}_${pY}_${pZ}`);
    }
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
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
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

  rotate(orientation, from, to, angular, linear) {
    this.scene.player.orientation = orientation;
    BABYLON.Animation.CreateAndStartAnimation(
      this.constructor.name,
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(from),
      BABYLON.Tools.ToRadians(to),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(av.z * angular.x, av.y * angular.y, av.x * angular.z)
    );
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(
      new BABYLON.Vector3(al.z * linear.x, al.y * linear.y, al.x * linear.z)
    );
  }
}

class RotatorFR extends Rotator {
  onPlayerCollision() {
    this.rotate("right", 270, 180, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(-1, 1, -1));
  }
}

class RotatorFL extends Rotator {
  onPlayerCollision() {
    this.rotate("left", 270, 360, new BABYLON.Vector3(-1, 0, 1), new BABYLON.Vector3(1, 1, 1));
  }
}

class RotatorBR extends Rotator {
  onPlayerCollision() {
    this.rotate("right", 90, 180, new BABYLON.Vector3(-1, 0, 1), new BABYLON.Vector3(1, 1, 1));
  }
}

class RotatorBL extends Rotator {
  onPlayerCollision() {
    this.rotate("left", 90, 180, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(1, 1, 1));
  }
}

class RotatorRF extends Rotator {
  onPlayerCollision() {
    this.rotate("front", 180, 270, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(-1, 1, 1));
  }
}

class RotatorRB extends Rotator {
  onPlayerCollision() {
    this.rotate("back", 180, 90, new BABYLON.Vector3(1, 0, -1), new BABYLON.Vector3(1, 1, 1));
  }
}

class RotatorLF extends Rotator {
  onPlayerCollision() {
    this.rotate("front", 360, 270, new BABYLON.Vector3(1, 0, -1), new BABYLON.Vector3(1, 1, 1));
  }
}

class RotatorLB extends Rotator {
  onPlayerCollision() {
    this.rotate("back", 0, 90, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(-1, 1, 1));
  }
}
