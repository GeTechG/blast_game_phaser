import Container = Phaser.GameObjects.Container;
import Button from "./button";

export default class GameOver extends Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        let text = scene.add.text(50, 50, "Game Over!", {
            fontFamily: "Marvin",
            fontSize: "54pt",
            align: "center",
            fixedWidth: 500
        });
        this.add(text);
        let restart_button = new Button(this.scene, 150, 150, "Заного", () => {
            this.scene.scene.restart();
        });
        this.add(restart_button);


        this.scene.add.existing(this);
    }
}