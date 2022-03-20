export default class Player {
  constructor(scene) {
    this.scene = scene;
    this.head = BABYLON.MeshBuilder.CreateSphere(
      "playerHead",
      { height: 1, width: 1, depth: 1, diameter: 0.5 },
      this.scene.scene
    );
    this.head.material = new BABYLON.StandardMaterial("materialHead", this.scene.scene);
    this.head.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

    this.initEyes();

    this.player = BABYLON.Mesh.MergeMeshes([this.head, this.eyeL, this.eyeR], true, true, undefined, false, true);

    this.initPhisics();
  }

  initPhisics() {
    this.head.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.player,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1, restitution: 3.5 },
      this.scene.scene
    );
    this.player.position = new BABYLON.Vector3(0, 10, 0);

    this.player.showBoundingBox = true;

    this.scene.camera.lockedTarget = this.player;

    this.groundCheckRay = new BABYLON.Ray(this.player.position, new BABYLON.Vector3(0, -1, 0), 10);

    this.speed = 0;
    this.jump = 2;
    this.lastJump = Date.now();
  }

  initEyes() {
    this.eyeL = BABYLON.Mesh.CreatePolyhedron("playerEyeL", { type: 1, size: 0.1 }, this.scene.scene);
    this.eyeL.position.z = 0.5;
    this.eyeL.material = new BABYLON.StandardMaterial("materialEyeL", this.scene.scene);
    this.eyeL.material.emissiveColor = new BABYLON.Color3(0, 0, 1);

    this.eyeR = BABYLON.Mesh.CreatePolyhedron("playerEyeR", { type: 1, size: 0.1 }, this.scene.scene);
    this.eyeR.position.z = -0.5;
    this.eyeR.material = new BABYLON.StandardMaterial("materialEyeR", this.scene.scene);
    this.eyeR.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  }

  move() {
    this.checkGroundDistance();
    if (this.scene.inputStates.up && this.canJump()) {
      this.head.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-this.speed, 8, 0));
      this.jump--;
      this.lastJump = Date.now();
    }
    if (this.scene.inputStates.down) {
      this.speed = 0;
      this.head.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
      this.head.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    }
    if (this.scene.inputStates.left) {
      this.updateSpeed(true);
      this.head.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, this.speed, 0));
    }
    if (this.scene.inputStates.right) {
      this.updateSpeed(false);
      this.head.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, this.speed, 0));
    }
    this.updateColor();
  }

  checkGroundDistance() {
    this.groundCheckRay.origin = this.player.getAbsolutePosition();
    let distance = this.scene.scene.pickWithRay(this.groundCheckRay, (mesh) => mesh != this.player).distance;
    if (distance != 0 && distance <= 0.5 + 0.2) {
      this.jump = 2;
    }
  }

  canJump() {
    return this.jump > 0 && Date.now() - this.lastJump > 200;
  }

  updateSpeed(increase) {
    let delta = increase ? 0.1 : -0.1;
    const maxSpeed = 15;

    if (this.speed >= -maxSpeed && this.speed <= maxSpeed) {
      if (this.speed > -1 && this.speed < 1) {
        this.speed += delta * 1;
        return;
      }
      if (this.speed > -5 && this.speed < 5) {
        this.speed += delta * 3;
      } else {
        this.speed += delta * 5;
      }
    }
    if (this.speed > maxSpeed) {
      this.speed = maxSpeed;
    } else if (this.speed < -maxSpeed) {
      this.speed = -maxSpeed;
    }
  }

  updateColor() {
    let color;
    switch (this.jump) {
      case 0:
        color = new BABYLON.Color3(1, 0, 0);
        break;
      case 1:
        color = new BABYLON.Color3(1, 1, 0);
        break;
      default:
        color = new BABYLON.Color3(1, 1, 1);
    }
    this.head.material.emissiveColor = color;
  }
}
