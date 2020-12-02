import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {PlaneConfig} from "../configs/PlaneConfig";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {IMediator} from "../framework/mvc/IMediator";
import {FormationConfig} from "../configs/FormationConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {SoundConfig} from "../configs/SoundConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class LoginScene extends cc.Component implements IMediator{

    @property(cc.Sprite)
    planeSpt: cc.Sprite = null;
    @property([cc.SpriteFrame])
    planeSptArr: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    background0:cc.Sprite = null;
    @property(cc.Sprite)
    background1:cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgSptArr: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    startHint:cc.Sprite = null;

    getCommands():string[] {
        return [];
    }

    protected onLoad(): void {
        GameUtil.playMusic(SoundConfig.mainMusic_mp3);
        FormationConfig.formationConfig = FormationConfig.transformToPixel(CommonConfig.ENEMY_WIDTH, CommonConfig.ENEMY_HEIGHT,
            FormationConfig.formationConfig)
        Player.player = new Player();
        Player.player.createPlayer();
        this.initLoginScene();
        this.node.on('touchend', function (event) {
            cc.director.loadScene('fightScene');
        });
    }

    start () {
    }

    update (dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    initLoginScene() {
        //加载当前使用战机
        let planeConfig = PlaneConfig.getPlaneConfig(Player.player.data.currentPlaneID)
        this.planeSpt.spriteFrame = this.planeSptArr[planeConfig.bigPngName];
        //随机背景图片
        Player.player.bgIndex = parseInt("" + Math.random() * 3);
        const bgIndex = Player.player.bgIndex;
        this.setBackground();
        //开始游戏图片添加效果
        let tween = cc.tween()
            .to(0.6, {scale: 0.9})
            .to(0.6, {scale: 1});
        tween = cc.tween().repeatForever(tween);
        cc.tween(this.startHint.node).then(tween).start()
    }

    setBackground() {
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
    }
}
