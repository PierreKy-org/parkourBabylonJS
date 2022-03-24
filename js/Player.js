export default class Player {
  constructor(scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateSphere(
      "playerHead",
      { height: 1, width: 1, depth: 1, diameter: 0.5 },
      this.scene.scene
    );
    this.mesh.material = new BABYLON.StandardMaterial("materialPlayer", this.scene.scene);
    this.mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

    var texture = new BABYLON.Texture("../assets/nut.png", this.scene.scene);
    this.mesh.material.diffuseTexture = texture;

    this.initPhisics();
  }

  initPhisics() {
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.mesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1, restitution: 3.5 },
      this.scene.scene
    );
    this.mesh.reIntegrateRotationIntoRotationQuaternion = true;
    this.mesh.position = new BABYLON.Vector3(0, 10, 0);

    this.mesh.showBoundingBox = true;

    this.groundCheckRay = new BABYLON.Ray(this.mesh.position, new BABYLON.Vector3(0, -1, 0), 10);

    this.speed = 0;
    this.jump = 2;
    this.angle = 0;
    this.lastJump = Date.now();
  }

  move() {
    this.checkGroundDistance();
    if (this.scene.inputStates.up && this.canJump()) {
      this.setLinearVelocity();
      this.jump--;
      this.lastJump = Date.now();
    }
    if (this.scene.inputStates.down) {
      this.speed = 0;
      this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
      this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
      this.resetRotation();
    }
    if (this.scene.inputStates.left) {
      this.updateSpeed(true);
      this.setAngularVelocity();
    }
    if (this.scene.inputStates.right) {
      this.updateSpeed(false);
      this.setAngularVelocity();
    }
    this.updateColor();
  }

  checkGroundDistance() {
    this.groundCheckRay.origin = this.mesh.getAbsolutePosition();
    let distance = this.scene.scene.pickWithRay(this.groundCheckRay, (mesh) => mesh != this.mesh).distance;
    if (distance != 0 && distance <= 0.5 + 0.2) {
      this.jump = 2;
    }
  }

  canJump() {
    return this.jump > 0 && Date.now() - this.lastJump > 200;
  }

  resetRotation() {
    this.mesh.rotationQuaternion.x = 0;
    this.mesh.rotationQuaternion.y = 0;
    this.mesh.rotationQuaternion.z = 0;
  }

  setLinearVelocity() {
    var vector;
    switch (this.angle) {
      case 0:
        vector = new BABYLON.Vector3(-this.speed, 8, 0);
        break;
      case 90:
        vector = new BABYLON.Vector3(0, 8, this.speed);
        break;
      case 180:
        vector = new BABYLON.Vector3(this.speed, 8, 0);
        break;
      case 270:
        vector = new BABYLON.Vector3(0, 8, -this.speed);
        break;
    }
    this.mesh.physicsImpostor.setLinearVelocity(vector);
  }

  setAngularVelocity() {
    var vector;
    switch (this.angle) {
      case 0:
        vector = new BABYLON.Quaternion(0, 0, this.speed, 0);
        break;
      case 90:
        vector = new BABYLON.Quaternion(this.speed, 0, 0, 0);
        break;
      case 180:
        vector = new BABYLON.Quaternion(0, 0, -this.speed, 0);
        break;
      case 270:
        vector = new BABYLON.Quaternion(-this.speed, 0, 0, 0);
        break;
    }
    this.mesh.physicsImpostor.setAngularVelocity(vector);
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
    this.mesh.material.emissiveColor = color;
  }
}
