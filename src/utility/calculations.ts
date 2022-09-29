import {AREA_WIDTH} from "./constants";

export function positionToId(x: number, y: number): number {
    return y * AREA_WIDTH + x;
}

export function idToPosition(id: number): [number, number] {
    return [id % AREA_WIDTH, Math.floor(id / AREA_WIDTH)];
}