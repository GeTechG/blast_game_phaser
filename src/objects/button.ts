import Container = Phaser.GameObjects.Container;

export default class Button extends Container {

    static loadTextures(scene: Phaser.Scene) {
        scene.load.image("button_bg", "assets/button_bg.png");
    }

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: () => void) {
        super(scene, x, y);
        let buttonBg = scene.add.image(0, 0, "button_bg");
        buttonBg.setScale(0.34, 0.34);
        buttonBg.setOrigin(0, 0);
        this.add(buttonBg);

        let textObject = scene.add.text(0, 15, text, {
            fontFamily: "Marvin",
            fontSize: "24pt",
            align: "center",
            fixedWidth: 200
        });
        this.add(textObject);

        buttonBg.setDisplaySize(textObject.width, textObject.height + 35);

        buttonBg.setInteractive();
        buttonBg.on("pointerup", callback);
    }
}