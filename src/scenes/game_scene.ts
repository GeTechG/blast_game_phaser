import Block from "../objects/block";
import {AREA_X, AREA_Y, DESTROY_TIME, STATISTIC_PANEL_X, STATISTIC_PANEL_Y} from "../utility/constants";
import Area from "../objects/area";
import ScoresPanel from "../objects/scores_panel";
import StatisticPanel from "../objects/statistic_panel";
import GameOver from "../objects/game_over";
import Button from "../objects/button";
import WinPopup from "../objects/win_popup";
import CheatButton from "../objects/cheat_button";

export enum Cheat {
    None,
    Bomb
}

export default class GameScene extends Phaser.Scene {
    private scores: number;
    private scoresToWin: number;
    private allowSteps: number;
    private area: Area;
    private scoresPanel: ScoresPanel;
    private statisticPanel: StatisticPanel;
    private _gameActive: boolean;
    private cheatBomb: CheatButton;
    private cheatReroll: CheatButton;
    private _usedCheat: Cheat;

    constructor() {
        super({
            key: "MainScene"
        });
    }
    preload(): void {
        Area.loadTextures(this);
        Block.loadTextures(this);
        ScoresPanel.loadTextures(this);
        StatisticPanel.loadTextures(this);
        Button.loadTextures(this);
        CheatButton.loadTextures(this);

        this.load.image("bomb", "assets/bomb.png");
        this.load.image("reroll", "assets/reroll.png");
    }

    create(): void {
        this.area = new Area({
            scene: this,
            x: AREA_X,
            y: AREA_Y
        });
        this.area.fillArea();

        this.scoresToWin = 120;
        this.scores = 0;
        this.allowSteps = 14;
        this._gameActive = true;
        this._usedCheat = Cheat.None;

        this.scoresPanel = new ScoresPanel(this, Number(this.game.config.width) / 2, 0);
        this.scoresPanel.setProgress(this.scores / this.scoresToWin);

        this.statisticPanel = new StatisticPanel(this, STATISTIC_PANEL_X, STATISTIC_PANEL_Y);
        this.statisticPanel.setSteps(this.allowSteps);
        this.statisticPanel.setTargetScores(this.scoresToWin);
        this.statisticPanel.setScores(this.scores);

        this.cheatBomb = new CheatButton(this, 780, 570,  "bomb", 1, () => {
            this._usedCheat = Cheat.Bomb;
        });
        this.cheatReroll = new CheatButton(this, 950, 570,  "reroll", 2, () => {
            this.area.fillArea();
        });
    }

    public addScores(scores: number) {
        this.scores += scores;
        this.scoresPanel.setProgress(this.scores / this.scoresToWin);
        this.statisticPanel.setScores(this.scores);
        if (this.scores >= this.scoresToWin) {
            this._gameActive = false;
            this.tweens.add({
                targets: this.area,
                duration: DESTROY_TIME,
                alpha: 0,
                onComplete: tween => {
                    new WinPopup(this, AREA_X, AREA_Y);
                    this.area.destroy(true);
                }
            });
        }
    }

    public useStep() {
        this.allowSteps--;
        this.statisticPanel.setSteps(this.allowSteps);
        if (this.allowSteps <= 0 && this.scores < this.scoresToWin) {
            this._gameActive = false;
            this.tweens.add({
                targets: this.area,
                duration: DESTROY_TIME,
                alpha: 0,
                onComplete: tween => {
                    new GameOver(this, AREA_X, AREA_Y);
                    this.area.destroy(true);
                }
            })
        }
    }


    get gameActive(): boolean {
        return this._gameActive;
    }


    set usedCheat(value: Cheat) {
        this._usedCheat = value;
    }

    get usedCheat(): Cheat {
        return this._usedCheat;
    }
}