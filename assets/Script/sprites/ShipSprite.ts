import {CommonConfig} from "../configs/CommonConfig";
import {Player} from "../classes/Player";
import {IMediator} from "../framework/mvc/IMediator";
import {GameEvent} from "../common/GameEvent";
import {ObserverManager} from "../framework/observe/ObserverManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ShipSprite extends cc.Component implements IMediator{
    //护盾动画
    @property(cc.Sprite)
    protectSprite:cc.Sprite = null;
    //磁铁动画
    @property(cc.Sprite)
    magnetSprite:cc.Sprite = null;
    //冲刺动画
    @property(cc.Sprite)
    spurtSprite:cc.Sprite = null;
    //机身
    @property(cc.Sprite)
    public shipSprite:cc.Sprite = null;
    //冲刺蓄能动画
    @property(cc.Sprite)
    spurtReadySprite:cc.Sprite = null;
    //升级特效—翅膀
    @property(cc.Sprite)
    levelUpWing:cc.Sprite = null;
    //升级特效—光圈
    @property(cc.Sprite)
    levelUpRing:cc.Sprite = null;
    //升级特效—喷光
    @property(cc.Sprite)
    levelUpJet:cc.Sprite = null;
    //升级特效—爆炸光
    @property(cc.Sprite)
    levelUpLight:cc.Sprite = null;
    //升级特效—飞机图
    @property(cc.Sprite)
    levelUpBigPlane:cc.Sprite = null;

    getCommands():string[] {
        return [GameEvent.UP_GRADE];
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
    }

    onUpGrade(grade:number){
        console.log("onUpGrade "+grade);
        // g_sharedGameLayer._ship.levelUpAction();
    }

    //显示护盾
    public setProtect(state){
        Player.player._protecting = state;
        this.protectSprite.node.active=state;
    }

}