import {Player} from "../classes/Player";
import {IMediator} from "../framework/mvc/IMediator";
import {GameEvent} from "../common/GameEvent";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "../configs/SoundConfig";
import FightScene from "../scene/FightScene";
import {CLEAN_TYPE} from "../common/enum/FlyStateEnum";
import {CommonConfig} from "../configs/CommonConfig";

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
    @property(cc.Animation)
    deadEffect:cc.Animation = null;
    //死亡特效

    getCommands():string[] {
        return [GameEvent.UP_GRADE];
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
    }

    onUpGrade(grade:number){
        // g_sharedGameLayer._ship.levelUpAction();
    }

    //显示护盾
    public setProtect(state){
        Player.player._protecting = state;
        this.protectSprite.node.active=state;
    }

    //敌机与玩家的碰撞
    onCollisionEnter(other, self) {
        //冲刺阶段
        if(!Player.player._spurt&&!Player.player._bomb){
            this.hurt();
        }
        // enemy.hurt(-1,true);
    }

    hurt(){
        if(Player.player._invincible||Player.player.debugMode) return;
        let fightScene:FightScene = FightScene.getFightScene();
        //是否在护盾状态下
        if(Player.player._protecting){
            GameUtil.playEffect(SoundConfig.shield);  //音效
            FightScene.getFightScene().cleanEnemy(CLEAN_TYPE.ALL, false);
            this.protectSprite.node.runAction(cc.sequence(cc.scaleBy(0.4,40),
                cc.callFunc(function(){this.setProtect(false);},this)));
        }//判断是否有接力
        else if(Player.player._revivePlaneID>0){
            this.death();
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(this.storeItemRevive,this)
            ));
        }
        //判断死亡时是否有商城道具触发
        else if(!fightScene.storeItemEffect("death")){
            this.death();
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(fightScene.onGameOver)
            ));
        }
    }

    //死亡
    death(){
        //音效
        GameUtil.playEffect(SoundConfig.firework);
        Player.player._death = true;
        Player.player._stopBullet = true;
        this.deadEffect.node.active = true;
        this.deadEffect.play();
        cc.tween(FightScene.getFightScene().node).then(GameUtil.shakeBy(0.5,50,10));
        this.node.active = false;
    }
    comeOnStage(){
        //登场动画;
        this.node.setPosition(0,-CommonConfig.HEIGHT-this.node.height);
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.moveTo(0.4, this.node.x, -CommonConfig.HEIGHT/5),
            cc.moveTo(0.3, this.node.x, -CommonConfig.HEIGHT/3),
            cc.callFunc(function(){
                Player.player._stopBullet = false;
            })
        ));
    }
    //道具复活
    storeItemRevive(){
        // Player.player._changePlaneIng = true;
        // //出现道具图标
        // var storeItemIcon = g_FightUILayer._storeItemRevive;
        // storeItemIcon.setPosition(VVV.WIDTH_HALF, VVV.HEIGHT_HALF);
        // storeItemIcon.setScale(8);
        // storeItemIcon.runAction(cc.sequence(
        //     cc.callFunc(function(){
        //         storeItemIcon.setVisible(true);
        //     }),
        //     cc.scaleTo(0.2,1),
        //     hlx.shakeBy(0.3,10,5),
        //     cc.delayTime(0.5),
        //     VVV.getHideSelfCallFun(storeItemIcon),
        //     cc.callFunc(function(){
        //         g_sharedGameLayer._ship.revive();
        //         g_sharedGameLayer._ship.changePlane(VVV.getPlaneConfig(g_sharedGameLayer._revivePlaneID));
        //         g_sharedGameLayer._revivePlaneID = 0;
        //     }),
        //     cc.delayTime(1),
        //     cc.callFunc(function(){
        //         g_sharedGameLayer._ship._changePlaneIng = false;
        //     })
        // ));
    }
}