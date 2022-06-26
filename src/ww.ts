import ProtoBuf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import type { Result } from './type';

self.onmessage = async (e) => {
    const url = e.data as string;
    let layers: Record<string, Result[]> = {};
    const resp = await fetch(url);
    const body = await resp.blob();
    const pbf = new ProtoBuf(await body.arrayBuffer());
    const tile = new VectorTile(pbf);
    for (const [key, value] of Object.entries(tile.layers)) {
        layers[key] = [];
        for (let index = 0; index < value.length; ++index) {
            const feature = value.feature(index);
            if (feature.type === 3) {
                const geom = feature.loadGeometry();
                const res = feature.extent;
                layers[key].push({
                    type: feature.type,
                    v2: geom.map((points) => points.map((p) => new Vector2(p.x / res, -p.y / res))),
                    v3: []
                });
            } else if (feature.type === 2) {
                const geom = feature.loadGeometry();
                const res = feature.extent;
                layers[key].push({
                    type: feature.type,
                    v2: [],
                    v3: geom.map((points) =>
                        points.map((p) => new Vector3(p.x / res, 0, -p.y / res))
                    )
                });
            }
        }
    }

    postMessage(layers);
    close();
};
