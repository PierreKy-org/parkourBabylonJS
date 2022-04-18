export default class AssetsManager {
  Assets = {};

  constructor(scene, assets) {
    this.assetsManager = new BABYLON.AssetsManager(scene);

    this.assetsManager.onTaskSuccessObservable.add((task) => {
      this.Assets[task.name] = { name: task.name, meshes: task.loadedMeshes };
    });

    var keys = Object.keys(assets);
    keys.forEach((key) => {
      this.assetsManager.addMeshTask(key, "", assets[key].path, assets[key].gltf);
    });

    this.assetsManager.load();
  }
}
