/**
 * Created by vlad.chirkov on 30.5.17.
 */
import {Geometry, Vector3} from 'three';
import {times} from 'lodash';

export default class CircularPointsGeometry extends Geometry {
    constructor(radius, number) {
        super();
        this._radius = radius;
        this._number = number;

        times(this._number, () => {
            let pos = Math.random() * 2 * Math.PI;
            this.vertices.push(new Vector3(Math.cos(pos) * this._radius, Math.sin(pos) * this._radius, 0));
        });
    }
}