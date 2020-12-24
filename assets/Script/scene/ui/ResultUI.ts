import {ObserverManager} from "../../framework/observe/ObserverManager";
import {CommonConfig} from "../../configs/CommonConfig";
import {GameUtil} from "../../common/GameUtil";
import {Player} from "../../classes/Player";
import {ConfigUtil} from "../../common/ConfigUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonUtil} from "../../common/CommonUtil";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ResultUI extends cc.Component{
    @property(cc.Sprite)
    background0: cc.Sprite = null;
    @property(cc.Sprite)
    background1: cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgSptArr: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    planeSpt: cc.Sprite = null;
    @property([cc.SpriteFrame])
    planeSptArr: cc.SpriteFrame[] = [];

    @property(cc.Label)
    awardGoldLab: cc.Label = null;
    @property(cc.Label)
    currentDisLab: cc.Label = null;
    @property(cc.Label)
    maxDisLab: cc.Label = null;
    @property(cc.Sprite)
    newRecordImg: cc.Sprite = null;

    @property(cc.Button)
    resetBtn: cc.Button = null;

    protected onLoad(): void {
        this.resetBtn.node.on(cc.Node.EventType.TOUCH_END, this.onResetBtn, this);
        this.init();
    }

    protected onDisable(): void {
        this.resetBtn.node.off(cc.Node.EventType.TOUCH_END, this.onResetBtn, this);
    }

    protected update(dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    private init(){
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID)
        this.planeSpt.spriteFrame = this.planeSptArr[planeConfig.nameIndex];
        this.awardGoldLab.string = Player.player.currentRewardGold + "";
        let currentDis:number = Math.round(Player.player.currentDistance);
        let maxDistance:number = Math.round(Player.player.data.maxDistance);
        this.currentDisLab.string = currentDis + "";
        if(currentDis>maxDistance){
            Player.player.updateMaxDistance();
            this.newRecordImg.node.active = true;
            maxDistance = currentDis;
        }else {
            this.newRecordImg.node.active = false;
        }
        if(maxDistance==0){
            this.maxDisLab.string = currentDis + "";
        }else {
            this.maxDisLab.string = maxDistance + "";
        }
    }

    private onResetBtn(){
        GameUtil.playMusic(SoundConfig.mainMusic_mp3+""+CommonUtil.random(0,2));
        cc.director.loadScene('storeScene');
    }
}