import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;

export default class StatisticPanel {
    private scene: Phaser.Scene;
    private statistic_panel: Image;
    private bg_circle: Image;
    private steps_text: Text
    private info_bg_rect_target: Image;
    private info_bg_rect_scores: Image;
    private target_text: Text;
    private target_value_text: Text;
    private scores_text: Text;
    private scores_value_text: Text;

    static loadTextures(scene: Phaser.Scene) {
        scene.load.image("statistic_panel", "assets/statistic_panel.png");
        scene.load.image("bg_circle", "assets/steps_bg_circle.png");
        scene.load.image("info_rect", "assets/info_rect.png");
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        let container = scene.add.container(x, y);

        this.statistic_panel = scene.add.image(0, 0, "statistic_panel");
        container.add(this.statistic_panel);

        const bg_circle_offset_x = 80;
        const bg_circle_offset_y = 20;
        this.bg_circle = scene.add.image(bg_circle_offset_x, bg_circle_offset_y, "bg_circle");
        container.add(this.bg_circle);

        const steps_text_offset = 60;
        this.steps_text = scene.add.text(bg_circle_offset_x + steps_text_offset, bg_circle_offset_y + steps_text_offset, "3", {
            fontFamily: "Marvin",
            fontSize: "54pt",
            align: "center",
            fixedWidth: 100
        });
        container.add(this.steps_text);

        const info_offset_x = 85;
        const target_offset_y = 250;
        this.info_bg_rect_target = scene.add.image(info_offset_x, target_offset_y, "info_rect");
        container.add(this.info_bg_rect_target);

        const info_text_offset = 10;
        this.target_text = scene.add.text(info_offset_x, target_offset_y + info_text_offset, "Цель:", {
            fontFamily: "Marvin",
            fontSize: "16pt",
            align: "center",
            fixedWidth: 200
        });
        container.add(this.target_text);

        const value_offset = 25;
        this.target_value_text = scene.add.text(info_offset_x, target_offset_y + info_text_offset + value_offset, "20", {
            fontFamily: "Marvin",
            fontSize: "24pt",
            align: "center",
            fixedWidth: 200
        });
        container.add(this.target_value_text);

        const scores_offset_y = 100;
        this.info_bg_rect_scores = scene.add.image(info_offset_x, target_offset_y + scores_offset_y, "info_rect");
        container.add(this.info_bg_rect_scores);
        this.scores_text = scene.add.text(info_offset_x, target_offset_y + scores_offset_y + info_text_offset, "Очки:", {
            fontFamily: "Marvin",
            fontSize: "16pt",
            align: "center",
            fixedWidth: 200
        });
        container.add(this.scores_text);
        this.scores_value_text = scene.add.text(info_offset_x, target_offset_y + scores_offset_y + info_text_offset + value_offset, "23", {
            fontFamily: "Marvin",
            fontSize: "24pt",
            align: "center",
            fixedWidth: 200
        });
        container.add(this.scores_value_text);

        this.init();
    }

    private init() {
        this.statistic_panel.setScale(0.34, 0.45);
        this.statistic_panel.setOrigin(0, 0);

        this.bg_circle.setScale(0.34, 0.34);
        this.bg_circle.setOrigin(0, 0);

        this.info_bg_rect_target.setScale(0.24, 0.24);
        this.info_bg_rect_target.setOrigin(0, 0);

        this.info_bg_rect_scores.setScale(0.24, 0.24);
        this.info_bg_rect_scores.setOrigin(0, 0);
    }

    public setSteps(steps: number) {
        this.steps_text.text = steps.toString();
    }

    public setScores(scores: number) {
        this.scores_value_text.text = scores.toString();
    }

    public setTargetScores(target: number) {
        this.target_value_text.text = target.toString();
    }
}