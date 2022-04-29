export default class AssetsManager {
  Assets = {};
  Materials = {};

  constructor(scene, assets) {
    var { models, materials } = assets;

    this.assetsManager = new BABYLON.AssetsManager(scene);

    this.assetsManager.onTaskSuccessObservable.add((task) => {
      this.Assets[task.name] = { name: task.name, meshes: task.loadedMeshes };
    });

    var keys = Object.keys(models);
    keys.forEach((key) => {
      this.assetsManager.addMeshTask(key, "", models[key].path, models[key].gltf);
    });

    this.materials = materials.map((mat) => BABYLON.NodeMaterial.ParseFromFileAsync(mat.name, mat.path, scene.scene));
  }

  async load() {
    await this.assetsManager.loadAsync();

    let materials = await Promise.all(this.materials);
    materials.forEach((mat) => {
      this.Materials[mat.name] = mat;
    });
  }
}
