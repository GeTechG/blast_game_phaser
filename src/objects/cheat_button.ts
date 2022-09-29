import Container = Phaser.GameObjects.Container;
import Image = Phaser.GameObjects.Image;

export default class CheatButton extends Container {

    private countUse;

    static loadTextures(scene: Phaser.Scene) {
        scene.load.image("cheat_bg", "assets/cheat_bg.png");
        scene.load.image("cheat_label_bg", "assets/cheat_label_bg.png");
    }

    constructor(scene: Phaser.Scene, x: number, y: number, icon_texture: string, count: number, callbackUse: () => void) {
        super(scene, x, y);
        this.countUse = count;

        let cheat_bg = scene.add.image(0, 0, "cheat_bg");
        cheat_bg.setOrigin(0, 0);
        cheat_bg.setScale(0.34, 0.34);
        this.add(cheat_bg);

        let cheat_label_bg = scene.add.image(20, 80, "cheat_label_bg");
        cheat_label_bg.setOrigin(0, 0);
        cheat_label_bg.setScale(0.34, 0.34);
        this.add(cheat_label_bg);

        let icon = scene.add.image(50, 20, icon_texture);
        icon.setOrigin(0, 0);
        icon.setDisplaySize(60, 60);
        this.add(icon);

        let count_text = scene.add.text(20, 90, count.toString(), {
            fontFamily: "Marvin",
            fontSize: "16pt",
            align: "center",
            fixedWidth: 110
        })
        this.add(count_text);

        cheat_bg.setInteractive();
        cheat_bg.on("pointerup", () => {
            if (this.countUse > 0) {
                callbackUse();
                this.countUse--;
                count_text.text = this.countUse.toString();
            }
        });

        this.scene.add.existing(this);
    }
}