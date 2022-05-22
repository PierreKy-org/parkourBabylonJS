function getNoiseMap(mapSubX, mapSubZ, scale, amp) {
  noise.seed(Math.random());
  var mapData = new Float32Array(mapSubX * mapSubZ * 3);

  for (var l = 0; l < mapSubZ; l++) {
    for (var w = 0; w < mapSubX; w++) {
      var x = (w - mapSubX * 0.5) * 2.0;
      var z = (l - mapSubZ * 0.5) * 2.0;
      var y = noise.simplex2(x * scale, z * scale) * amp - amp;

      mapData[3 * (l * mapSubX + w)] = x;
      mapData[3 * (l * mapSubX + w) + 1] = y;
      mapData[3 * (l * mapSubX + w) + 2] = z;
    }
  }
  return mapData;
}

export function getDynamicTerrain(mapSubX, mapSubZ, scale, amp, scene) {
  var mapData = getNoiseMap(mapSubX, mapSubZ, scale, amp);

  return new BABYLON.DynamicTerrain(
    "ground",
    {
      mapData: mapData,
      mapSubX: mapSubX,
      mapSubZ: mapSubZ,
      terrainSub: 150,
    },
    scene
  );
}
