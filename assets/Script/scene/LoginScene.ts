import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {ConfigUtil} from "../common/ConfigUtil";
import {IMediator} from "../framework/mvc/IMediator";
import {SceneManager} from "../manager/scene/SceneManager";
import {GuideConfig} from "../configs/GuideConfig";

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
    @property(cc.Button)
    clearBtn:cc.Button = null;
    @property(cc.Button)
    checkBtn:cc.Button = null;

    getCommands(){
        return [];
    }

    protected onLoad(): void {
        this.clearBtn.node.on(cc.Node.EventType.TOUCH_END, function () {
            Player.player.clearData();
            location.reload()
        }, this);
        this.checkBtn.node.on(cc.Node.EventType.TOUCH_END, function () {
            window.alert(localStorage.playerData);
        }, this);
        ObserverManager.registerObserverFun(this);
        this.initLoginScene();
        this.node.on(cc.Node.EventType.TOUCH_END, this.openStoreScene, this);
    }

    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.openStoreScene);
    }

    protected update (dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    private initLoginScene() {
        //加载当前使用战机
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID)
        this.planeSpt.spriteFrame = this.planeSptArr[planeConfig.nameIndex];
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

    private openStoreScene(){
        if(Player.player.hasFinishGuide(GuideConfig.guideConfig.comeOnStage.name)){
            SceneManager.instance().changeScene("storeScene");
        }else {
            SceneManager.instance().changeScene("fightScene");
        }
    }
}
