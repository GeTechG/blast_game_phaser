import Image = Phaser.GameObjects.Image;
import {AREA_HEIGHT, AREA_PADDING, AREA_WIDTH, BLOCK_SIZE, MOVING_TIME} from "../utility/constants";
import {positionToId} from "../utility/calculations";
import Area from "./area";

export enum BlockType {
    Yellow,
    Red,
    Purple,
    Green,
    Blue,
    COUNT_BLOCK_TYPES
}

interface IBLockConstructorParameters {
    scene: Phaser.Scene,
    area: Area,
    type: BlockType,
    blockX: number,
    blockY: number
}

export default class Block extends Image {
    private _blockX: number;
    private _blockY: number;
    private readonly _blockType: BlockType;
    private readonly area: Area;

    static loadTextures(scene: Phaser.Scene): void {
        scene.load.image("greenBlock", "assets/blocks/green.png");
        scene.load.image("purpleBlock", "assets/blocks/purple.png");
        scene.load.image("redBlock", "assets/blocks/red.png");
        scene.load.image("yellowBlock", "assets/blocks/yellow.png");
        scene.load.image("blueBlock", "assets/blocks/blue.png");
    }

    private static getTextureByType(type: BlockType) {
        switch (type) {
            case BlockType.Green:
                return "greenBlock"
            case BlockType.Yellow:
                return "yellowBlock"
            case BlockType.Red:
                return "redBlock"
            case BlockType.Purple:
                return "purpleBlock"
            case BlockType.Blue:
                return "blueBlock"
            default:
                console.error("invalid block type");
        }
    }

    constructor(params: IBLockConstructorParameters) {
        let texture = Block.getTextureByType(params.type);
        const x = params.blockX * BLOCK_SIZE + BLOCK_SIZE / 2 - BLOCK_SIZE * 0.03;
        const y = params.blockY * BLOCK_SIZE + BLOCK_SIZE / 2 - BLOCK_SIZE * 0.03;
        super(params.scene, x, y, texture);

        this._blockX = params.blockX;
        this._blockY = params.blockY;
        this._blockType = params.type;
        this.area = params.area;

        this.initTexture();
    }

    private initTexture() {
        this.setScale(0.33, 0.33);
        this.setInteractive();
    }


    get blockX(): number {
        return this._blockX;
    }

    get blockY(): number {
        return this._blockY;
    }

    get blockType(): BlockType {
        return this._blockType;
    }

    public get id(): number {
        return positionToId(this._blockX, this._blockY);
    }

    public move(x: number, y: number) {
        this._blockX = x;
        this._blockY = y;
        this.scene.tweens.add({
            targets: this,
            duration: MOVING_TIME,
            x: x * BLOCK_SIZE + BLOCK_SIZE / 2 - BLOCK_SIZE * 0.03,
            y: y * BLOCK_SIZE + BLOCK_SIZE / 2 - BLOCK_SIZE * 0.03
        });
    }
}