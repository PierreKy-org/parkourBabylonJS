export default class Camera {
  constructor(scene) {
    this.scene = scene;
    this.camera = new BABYLON.ArcFollowCamera(
      "FollowCam",
      BABYLON.Tools.ToRadians(270),
      0,
      10,
      this.scene.player.mesh,
      this.scene.scene
    );

    this.initAnimations();
  }

  initAnimations() {
    this.alphaAnimation = new BABYLON.Animation(
      "rotateCamera",
      "alpha",
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.alphaAnimation.setKeys([
      {
        frame: 0,
        value: this.camera.alpha,
      },
      {
        frame: 100,
        value: BABYLON.Tools.ToRadians((this.scene.player.mesh.rotationQuaternion.y + 180) % 360),
      },
    ]);

    this.camera.animations.push(this.alphaAnimation);
  }

  startRotationAnimation() {
    this.scene.scene.beginAnimation(this.camera, 0, 100, true);
  }
}
