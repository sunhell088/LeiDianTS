import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "../configs/SoundConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {GameEvent} from "../common/GameEvent";
import {IMediator} from "../framework/mvc/IMediator";
import {ObserverManager} from "../framework/observe/ObserverManager";
import ItemSprite from "./ItemSprite";
import {ItemConfig} from "../configs/ItemConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ShipSprite extends cc.Component implements IMediator{
    //护盾动画
    @property(cc.Animation)
    protectSprite:cc.Animation = null;
    @property(cc.Animation)
    protectExplodeSprite:cc.Animation = null;
    //磁铁动画
    @property(cc.Sprite)
    magnetSprite:cc.Sprite = null;
    //冲刺准备的爆炸动画
    @property(cc.Animation)
    spurtStartExplode:cc.Animation = null;
    //冲刺中的缩放动画
    @property(cc.Animation)
    spurtDuration:cc.Animation = null;
    //冲刺结束的爆炸动画
    @property(cc.Animation)
    spurtEndExplode:cc.Animation = null;
    //机身
    @property(cc.Sprite)
    shipSprite:cc.Sprite = null;
    //机身图集
    @property(cc.SpriteAtlas)
    shipSpriteAtlas:cc.SpriteAtlas = null;
    @property(cc.Node)
    eatItemEffect:cc.Node = null;


    getCommands():string[] {
        return [GameEvent.RESTART_GAME, GameEvent.GAME_OVER, GameEvent.ITEM_COLLISION_PLAYER,
            GameEvent.ROCK_COLLISION_PLAYER, GameEvent.EAT_ITEM,GameEvent.COLLIDER_MAGNET];
    }
    
    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
        this.schedule(this.deductMagnetTime, 0.1);
        this.schedule(this.deductProtectTime, 0.1);
        this.schedule(this.deductDoubleFireTime, 0.1);
    }
    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
        this.unschedule(this.deductMagnetTime);
        this.unschedule(this.deductProtectTime);
        this.unschedule(this.deductDoubleFireTime);
    }

    init(){
        this.comeOnStage();
    }

    private comeOnStage(){
        //登场动画;
        this.node.setPosition(0,-CommonConfig.HEIGHT/2-this.node.height);
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.moveTo(0.4, this.node.x, -CommonConfig.HEIGHT/5),
            cc.moveTo(0.3, this.node.x, -CommonConfig.HEIGHT/3),
            cc.callFunc(function(){
                Player.player._stopBullet = false;
            })
        ));
    }

    destroyShipSprite(){
        this.node.active = false;
    }

    hurt(){
        if(Player.player._bomb||Player.player._spurtReadying||Player.player._spurt||Player.player.debugMode) return;
        //是否在护盾状态下
        if(Player.player._protecting){
            GameUtil.playSound(SoundConfig.shield);  //音效
            ObserverManager.sendNotification(GameEvent.PROTECT_EFFECT);
            this.protectExplodeSprite.node.active = true;
            this.protectExplodeSprite.play();
            this.protectExplodeSprite.on(cc.Animation.EventType.FINISHED, function () {
                this.protectExplodeSprite.node.active = false;
                this.protectExplodeSprite.off(cc.Animation.EventType.FINISHED);
            }, this);
            this.deductProtectTime();
        }
        else{
            this.death();
            ObserverManager.sendNotification(GameEvent.GAME_OVER);
        }
    }

    //死亡
    death(){
        //音效
        GameUtil.playSound(SoundConfig.firework);
        Player.player._death = true;
        Player.player._stopBullet = true;
        this.destroyShipSprite();
    }

    attractItem(itemSprite:ItemSprite){
        itemSprite.node.stopAllActions();
        let moveTo = cc.moveTo(0.1, new cc.Vec2(this.node.x, this.node.y));
        itemSprite.node.runAction(cc.sequence(
            moveTo,
            cc.callFunc(itemSprite.destroySprite, itemSprite)
        ));
    }

    getPlayerSprintExplodeAnimation(){
        // this.playerSprintExplode.active = true;
        // this.playerSprintExplode.getComponent(cc.Animation).play();
        return new cc.ActionInterval;
    }

    playEatItemEffectAnimation(){
        this.eatItemEffect.getComponent(cc.Animation).play();
    }


    //吃道具闪一下光
    private eatItemBlink(itemConfig:any){
        this.eatItemEffect.active = true;
        this.eatItemEffect.runAction(cc.sequence(
            cc.scaleTo(0.2, 0, 1),
            cc.callFunc(function(sender){
                sender.setScale(1);
                sender.active = false;
                sender.stopAllActions()
            },this.eatItemEffect)
        ));
        if(itemConfig.gold){
            if(itemConfig == ItemConfig.itemConfig.item_coin){
                GameUtil.playSound(SoundConfig.get_coin);
            }else{
                GameUtil.playSound(SoundConfig.get_bs);
            }
        }else {
            GameUtil.playSound(SoundConfig.get_item);
        }
    }
    //冲刺表现动画
    private itemFunctionSpurt(){
        if(Player.player._spurt||Player.player._spurtReadying) return;
        //冲刺持续时间
        var spurtDuration = CommonConfig.SPURT_DURATION;
        //冲刺开始的蓄能动画
        GameUtil.playSound(SoundConfig.cc_ready);
        Player.player._spurtReadying = true;
        this.spurtStartExplode.node.active = true;
        this.spurtStartExplode.play();
        this.spurtStartExplode.on(cc.Animation.EventType.FINISHED, function () {
            this.spurtStartExplode.off(cc.Animation.EventType.FINISHED);
            //冲刺蓄能结束
            Player.player._spurtReadying = false;
            Player.player._spurt = true;
            //冲刺过程缩放光柱
            this.spurtDuration.node.active = true;
            this.spurtDuration.play();
            this.spurtStartExplode.node.active = false;
            this.spurtStartExplode.off(cc.Animation.EventType.FINISHED);
            ObserverManager.sendNotification(GameEvent.SPURT_DURATION, true);
            this.scheduleOnce(function() {
                //持续指定时间播放爆炸动画
                this.spurtDuration.node.active = false;
                this.spurtDuration.stop();
                Player.player._spurt = false;
                this.spurtEndExplode.node.active = true;
                this.spurtEndExplode.play();
                ObserverManager.sendNotification(GameEvent.SPURT_DURATION, false);
            }, spurtDuration);
        }, this);
    }
    //吸铁石效果
    private itemFunctionXTS(){
        this.setMagnetStart();
    }
    private itemFunctionProtect(){
        this.setProtectStart();
    }

    private itemFunctionDoubleFight(){
        this.setDoubleFireStart();
    }

    //显示磁铁
    setMagnetStart(){
        Player.player._magnet = true;
        this.magnetSprite.node.active = true;
        Player.player.magnetRemainTime = CommonConfig.MAGNET_TIME;
    }
    deductMagnetTime(){
        if(Player.player.magnetRemainTime>0){
            Player.player.magnetRemainTime -= 0.1;
            ObserverManager.sendNotification(GameEvent.DEDUCT_BUFF_TIME, ItemConfig.itemConfig.item_xts.name);
        }else {
            Player.player._magnet = false;
            this.magnetSprite.node.active = false;
        }
    }
    //显示护盾
    setProtectStart(){
        Player.player._protecting = true;
        this.protectSprite.node.active = true;
        Player.player.protectRemainTime = CommonConfig.PROTECT_TIME;
    }
    deductProtectTime(){
        if(Player.player.protectRemainTime>0){
            Player.player.protectRemainTime -= 0.1;
            ObserverManager.sendNotification(GameEvent.DEDUCT_BUFF_TIME, ItemConfig.itemConfig.item_protect.name);
        }else {
            Player.player._protecting = false;
            this.protectSprite.node.active = false;
        }
    }
    //双倍火力
    setDoubleFireStart(){
        Player.player._doubleFire = true;
        Player.player.doubleFireRemainTime = CommonConfig.DOUBLE_FIRE_TIME;
    }
    deductDoubleFireTime(){
        if(Player.player.doubleFireRemainTime>0){
            Player.player.doubleFireRemainTime -= 0.1;
            ObserverManager.sendNotification(GameEvent.DEDUCT_BUFF_TIME, ItemConfig.itemConfig.item_double.name);
        }else {
            Player.player._doubleFire = false;
        }
    }
    //--------游戏事件监听方法---------

    private RESTART_GAME(){
        this.node.stopAllActions();
    }

    private GAME_OVER(){
        this.node.stopAllActions();
    }

    private ITEM_COLLISION_PLAYER(itemConfig:any) {
        this.eatItemBlink(itemConfig);
    }

    private ROCK_COLLISION_PLAYER(){
        this.hurt();
    }

    private EAT_ITEM(itemConfigObj:any){
        switch (itemConfigObj.name) {
            case ItemConfig.itemConfig.item_cc.name:
                this.itemFunctionSpurt();
                break;
            case ItemConfig.itemConfig.item_xts.name:
                this.itemFunctionXTS();
                break;
            case ItemConfig.itemConfig.item_protect.name:
                this.itemFunctionProtect();
                break;
            case ItemConfig.itemConfig.item_double.name:
                this.itemFunctionDoubleFight();
                break;
        }
    }

    private COLLIDER_MAGNET(itemSpriteNode:ItemSprite){
        this.attractItem(itemSpriteNode);
    }
}