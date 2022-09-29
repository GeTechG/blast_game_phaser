import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Block, {BlockType} from "./block";
import {AREA_HEIGHT, AREA_PADDING, AREA_WIDTH, BLOCK_SIZE, DESTROY_TIME, MOVING_TIME} from "../utility/constants";
import {idToPosition, positionToId} from "../utility/calculations";
import GameScene, {Cheat} from "../scenes/game_scene";

interface IAreaConstructorParameters {
    scene: GameScene,
    x: number,
    y: number
}

enum AreaState {
    WaitStep,
    Moving
}

export default class Area extends Container {

    private gameScene: GameScene;
    private area: Image;
    private areaState: AreaState;
    private blocks: Block[] | null;
    private blocksContainer: Container;

    static loadTextures(scene: Phaser.Scene) {
        scene.load.image("area", "assets/area.png");
    }

    constructor(params: IAreaConstructorParameters) {
        super(params.scene, params.x, params.y);
        this.area = this.scene.add.image(0, 0, "area");
        this.add(this.area);
        this.init();
        this.areaState = AreaState.WaitStep;
        this.gameScene = params.scene;
        this.blocksContainer = params.scene.add.container(AREA_PADDING, AREA_PADDING);
        this.add(this.blocksContainer);
        this.scene.add.existing(this);
    }

    private init() {
        this.area.setOrigin(0, 0);
        this.area.setDisplaySize(AREA_PADDING * 2 + AREA_WIDTH * BLOCK_SIZE, AREA_PADDING * 2 + AREA_HEIGHT * BLOCK_SIZE);
    }

    private createBlock(x: number, y: number) {
        let blockType = Phaser.Math.RND.integerInRange(0, BlockType.COUNT_BLOCK_TYPES - 1);
        let block = new Block({
            scene: this.scene,
            area: this,
            type: blockType,
            blockX: x,
            blockY: y
        });

        block.on("pointerup", () => {
            this.tryStep(block);
        });
        this.blocksContainer.add(block);

        block.depth = AREA_WIDTH * AREA_HEIGHT - positionToId(x, y);

        return block;
    }

    public fillArea() {
        this.blocks = [];
        for (let y = 0; y < AREA_HEIGHT; y++) {
            for (let x = 0; x < AREA_WIDTH; x++) {
                let block = this.createBlock(x, y);
                this.blocks.push(block);
            }
        }
        this.blocksContainer.sort("y", (a:Block, b:Block) => a.blockY < b.blockY ? 1 : 0);
    }

    private tryStep(block: Block) {
        if (!this.gameScene.gameActive) {
            return;
        }
        if (this.areaState !== AreaState.WaitStep) {
            return;
        }
        let siblingsBlocks: Block[];
        switch (this.gameScene.usedCheat) {
            case Cheat.None:
                siblingsBlocks = Array.from(this.findSiblingsBlock(block));
                break;
            case Cheat.Bomb:
                siblingsBlocks = this.cheatBombSiblings(block);
                this.gameScene.usedCheat = Cheat.None;
                break;
        }
        if (siblingsBlocks.length > 1) {
            this.areaState = AreaState.Moving;

            this.scene.tweens.add({
                targets: Array.from(siblingsBlocks),
                duration: DESTROY_TIME,
                ease: "Back.easeInOut",
                scale: 0,
                onComplete: () => {
                    siblingsBlocks.forEach(b => {
                        this.blocksContainer.remove(b, true);
                        this.blocks.splice(b.id, 1, null);
                    });

                    this.gameScene.addScores(siblingsBlocks.length * (Math.floor(siblingsBlocks.length / 3) + 1));
                    this.gameScene.useStep();

                    this.moveBlocksOrCreateNew();
                    this.scene.time.addEvent({
                        delay: MOVING_TIME,
                        callback: () => this.areaState = AreaState.WaitStep
                    })
                }
            })
        }
    }

    private cheatBombSiblings(block: Block) {
        let siblingsBlocks = [];
        for (let i = -2; i < 2; i++) {
            for (let j = -2; j < 2; j++) {
                if (block.blockX + i < 0 || block.blockX + i >= AREA_WIDTH) {
                    continue;
                }
                if (block.blockY + j < 0 || block.blockY + j >= AREA_HEIGHT) {
                    continue;
                }
                siblingsBlocks.push(this.blocks.at(positionToId(block.blockX + i, block.blockY + j)));
            }
        }
        return siblingsBlocks;
    }

    private findSiblingsBlock(block: Block) {
        let siblingsBlocks: Set<Block> = new Set<Block>();
        let newSiblingsBlocks: Array<Block> = new Array<Block>();

        newSiblingsBlocks.push(block);
        while (newSiblingsBlocks.length > 0) {
            let siblingBlock = newSiblingsBlocks.shift();
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i !== 0 && j !== 0 || i === 0 && j === 0) {
                        continue;
                    }
                    if (siblingBlock.blockX + i < 0 || siblingBlock.blockX + i >= AREA_WIDTH) {
                        continue;
                    }
                    if (siblingBlock.blockY + j < 0 || siblingBlock.blockY + j >= AREA_HEIGHT) {
                        continue;
                    }
                    const presumedSiblingBlock = this.blocks.at(positionToId(siblingBlock.blockX + i, siblingBlock.blockY + j));
                    if (presumedSiblingBlock !== null) {
                        if (presumedSiblingBlock.blockType === block.blockType
                            && !siblingsBlocks.has(presumedSiblingBlock)) {
                            newSiblingsBlocks.push(presumedSiblingBlock);
                        }
                    }
                }
            }
            siblingsBlocks.add(siblingBlock);
        }

        return siblingsBlocks;
    }

    private moveBlocksOrCreateNew() {
        for (let x = 0; x < AREA_WIDTH; x++) {
            let emptyBlocksId: number[] = [];
            for (let y = AREA_HEIGHT - 1; y >= 0; y--) {
                const currentBlock = positionToId(x, y);
                if (this.blocks.at(currentBlock) === null) {
                    emptyBlocksId.push(currentBlock);
                } else {
                    if (emptyBlocksId.length > 0) {
                        const emptyBlockId = emptyBlocksId.shift();
                        this.blocks.splice(emptyBlockId, 1, this.blocks.splice(currentBlock, 1, null)[0])
                        this.blocks.at(emptyBlockId).move(...idToPosition(emptyBlockId));
                        emptyBlocksId.push(currentBlock);
                    }
                }
            }
            let maxY = Math.floor(Math.max.apply(null, emptyBlocksId) / AREA_WIDTH);
            emptyBlocksId.forEach(blockId => {
                let [x, y] = idToPosition(blockId);
                let block = this.createBlock(x, y - maxY - 1);
                block.move(x, y);
                block.depth = AREA_WIDTH * AREA_HEIGHT - blockId;
                this.blocks.splice(blockId, 1, block);
            })
            this.blocksContainer.sort("y", (a:Block, b:Block) => a.blockY < b.blockY ? 1 : 0);
        }
    }
}