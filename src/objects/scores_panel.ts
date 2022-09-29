import Image = Phaser.GameObjects.Image;
import {AREA_HEIGHT, AREA_WIDTH, PROGRESS_TIME} from "../utility/constants";

export default class ScoresPanel {

    private scene: Phaser.Scene;
    private bg_panel: Image;
    private progress_bar: Image;
    private progress: Image;

    static loadTextures(scene: Phaser.Scene) {
        scene.load.image("bg_score_panel", "assets/scores_panel.png");
        scene.load.image("bg_progress_scores", "assets/bg_progress_score.png");
        scene.load.image("progress_scores", "assets/progress_score.png");
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.bg_panel = scene.add.image(x, y, "bg_score_panel");
        this.progress_bar = scene.add.image(x - 210, y + 10, "bg_progress_scores");
        this.progress = scene.add.image(x - 210, y + 10, "progress_scores");

        this.scene = scene;

        this.init();
    }

    private init() {
        this.bg_panel.setDisplaySize(500, 60);
        this.bg_panel.setOrigin(undefined, 0);
        this.bg_panel.depth = AREA_WIDTH * AREA_HEIGHT + 100;

        this.progress_bar.setScale(0.34, 0.34);
        this.progress_bar.setOrigin(0, 0);
        this.progress_bar.depth = AREA_WIDTH * AREA_HEIGHT + 100;

        this.progress.setDisplaySize(0, this.progress_bar.displayHeight);
        this.progress.setOrigin(0, 0);
        this.progress.depth = AREA_WIDTH * AREA_HEIGHT + 100;
    }

    public setProgress(percent: number) {
        percent = Math.min(percent, 1);
        this.scene.tweens.add({
            targets: this.progress,
            duration: PROGRESS_TIME,
            displayWidth: this.progress_bar.displayWidth * percent
        });
    }
}