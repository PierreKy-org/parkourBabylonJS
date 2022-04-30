export default class AssetsManager {
  Assets = {};
  Materials = {};
  Audio = {};

  constructor(scene, assets) {
    var { models, materials, audio } = assets;

    this.assetsManager = new BABYLON.AssetsManager(scene);

    this.assetsManager.onTaskSuccessObservable.add((task) => {
      this.Assets[task.name] = { name: task.name, meshes: task.loadedMeshes };
    });

    //Assets
    var keys = Object.keys(models);
    keys.forEach((key) => {
      this.assetsManager.addMeshTask(key, "", models[key].path, models[key].gltf);
    });

    //Materials
    this.materials = materials.map((mat) => BABYLON.NodeMaterial.ParseFromFileAsync(mat.name, mat.path, scene.scene));

    //Audios
    var keys = Object.keys(audio);
    keys.forEach((key) => {
      this.Audio[key] = new BABYLON.Sound(key, audio[key].path, scene.scene, null, { loop: audio[key].loop });
    });
  }

  async load() {
    await this.assetsManager.loadAsync();

    let materials = await Promise.all(this.materials);
    materials.forEach((mat) => {
      this.Materials[mat.name] = mat;
    });
  }
}
