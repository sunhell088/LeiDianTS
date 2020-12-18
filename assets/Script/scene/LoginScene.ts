import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {FormationConfig} from "../configs/FormationConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {SoundConfig} from "../configs/SoundConfig";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {ConfigUtil} from "../common/ConfigUtil";
import {IMediator} from "../framework/mvc/IMediator";

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
        ObserverManager.registerObserverFun(this);
        //开启碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        CommonConfig.WIDTH = this.node.width;
        CommonConfig.HEIGHT = this.node.height;
        GameUtil.playMusic(SoundConfig.mainMusic_mp3);
        //因为transformToPixel会把相对标识改为绝对坐标
        if(!(FormationConfig.formationConfig[0][0] instanceof cc.Vec2)){
            FormationConfig.formationConfig = ConfigUtil.transformToPixel(CommonConfig.ENEMY_WIDTH, CommonConfig.ENEMY_HEIGHT,
                FormationConfig.formationConfig)
        }
        Player.player = new Player();
        Player.player.createPlayer();
        // Player.player.loadData();
        // this.schedule(Player.player.saveData, 1);
        this.initLoginScene();
        this.node.on(cc.Node.EventType.TOUCH_END, this.openSotreScene, this);
    }

    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.openSotreScene);
    }

    protected update (dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    private initLoginScene() {
        //加载当前使用战机
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID)
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

    private setBackground() {
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
    }

    private openSotreScene(){
        cc.director.loadScene('storeScene');
    }
}
