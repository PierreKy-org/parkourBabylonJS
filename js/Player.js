export default class Player {
  constructor(scene) {
    this.scene = scene;
    this.head = BABYLON.MeshBuilder.CreateSphere("playerHead", { height: 1, width: 1, depth: 1 }, this.scene.scene);
    this.head.material = new BABYLON.StandardMaterial("materialHead", this.scene.scene);
    this.head.material.emissiveColor = new BABYLON.Color3(0, 0, 0);

    this.eyeL = BABYLON.Mesh.CreatePolyhedron("playerEyeL", { type: 1, size: 0.1 }, this.scene.scene);
    this.eyeL.position.z = 0.5;
    this.eyeL.material = new BABYLON.StandardMaterial("materialEyeL", this.scene.scene);
    this.eyeL.material.emissiveColor = new BABYLON.Color3(0, 0, 1);

    this.eyeR = BABYLON.Mesh.CreatePolyhedron("playerEyeR", { type: 1, size: 0.1 }, this.scene.scene);
    this.eyeR.position.z = -0.5;
    this.eyeR.material = new BABYLON.StandardMaterial("materialEyeR", this.scene.scene);
    this.eyeR.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

    this.player = BABYLON.Mesh.MergeMeshes([this.head, this.eyeL, this.eyeR], true, true, undefined, false, true);

    this.head.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.player,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1, restitution: 3.5 },
      this.scene.scene
    );

    this.scene.camera.lockedTarget = this.player;

    this.frontVector = new BABYLON.Vector3(1, 1, 1);

    this.player.position = new BABYLON.Vector3(0, 10, 0);

    this.speed = 0;
  }

  move() {
    this.player.position.z = 0;
    if (this.scene.inputStates.up) {
      this.head.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 1, 0));
    }
    if (this.scene.inputStates.left) {
      this.updateSpeed(false);
      this.head.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, this.speed, 0));
    }
    if (this.scene.inputStates.right) {
      this.updateSpeed(true);
      this.head.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, this.speed, 0));
    }
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
}
