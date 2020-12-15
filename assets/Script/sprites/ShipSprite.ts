import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "../configs/SoundConfig";
import FightScene from "../scene/FightScene";
import {CommonConfig} from "../configs/CommonConfig";
import FightUI from "../scene/ui/FightUI";
import {PlaneConfig} from "../configs/PlaneConfig";
import {GameEvent} from "../common/GameEvent";
import {IMediator} from "../framework/mvc/IMediator";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {CLEAN_TYPE} from "../common/GameEnum";
import CanvasNode from "../scene/CanvasNode";
import ItemSprite from "./ItemSprite";
import {StoreItemConfig} from "../configs/StoreItemConfig";
import {ItemConfig} from "../configs/ItemConfig";
import {ConfigUtil} from "../common/ConfigUtil";

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
    }
    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
    }

    //重置飞机能力
    resetEffect(){
        this.setMagnetEnd();
        this.setProtectEnd();
        this.setDoubleFireEnd();
    }

    comeOnStage(){
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
        if(Player.player._spurt||Player.player.debugMode) return;
        //是否在护盾状态下
        if(Player.player._protecting){
            GameUtil.playSound(SoundConfig.shield);  //音效
            ObserverManager.sendNotification(GameEvent.PROTECT_EFFECT);
            this.protectExplodeSprite.node.active = true;
            this.protectExplodeSprite.play();
            this.protectExplodeSprite.on(cc.Animation.EventType.FINISHED, function () {
                this.protectExplodeSprite.node.active = false;
            }, this);
            this.setProtectEnd();
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
    //道具复活
    storeItemRevive(){
        Player.player._changePlaneIng = true;
        ObserverManager.sendNotification(GameEvent.STORE_ITEM_EFFECT, StoreItemConfig.storeItemConfig.revive);
    }

    revive(){
        Player.player._death = false;
        this.node.active = true
        Player.player._stopBullet = false;
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
            //冲刺蓄能结束
            Player.player._spurtReadying = false;
            Player.player._spurt = true;
            //冲刺过程缩放光柱
            this.spurtDuration.node.active = true;
            this.spurtDuration.play();
            this.spurtStartExplode.node.active = false;
            ObserverManager.sendNotification(GameEvent.SPURT_DURATION, true);
            this.scheduleOnce(function() {
                //持续指定时间播放爆炸动画
                this.spurtDuration.node.active = false;
                this.spurtDuration.stop();
                Player.player._spurt = false;
                this.scheduleOnce(function () {
                    this.spurtEndExplode.node.active = true;
                    this.spurtEndExplode.play();
                    ObserverManager.sendNotification(GameEvent.SPURT_DURATION, false);
                }, 0.7);
            }, spurtDuration);
        }, this);
    }
    //吸铁石效果
    private itemFunctionXTS(){
        this.setMagnetStart();
        this.unschedule(this.setMagnetEnd);
        this.scheduleOnce(this.setMagnetEnd, CommonConfig.XTS_TIME);
    }
    private itemFunctionProtect(){
        this.setProtectStart();
        this.unschedule(this.setProtectEnd);
        this.scheduleOnce(this.setProtectEnd, CommonConfig.PROTECT_TIME);
    }

    private itemFunctionDoubleFight(){
        this.setDoubleFireStart();
        this.unschedule(this.setDoubleFireEnd);
        this.scheduleOnce(this.setDoubleFireEnd, CommonConfig.DOUBLE_FIRE_TIME);
    }

    //显示磁铁
    setMagnetStart(){
        Player.player._magnet = true;
        this.magnetSprite.node.active = true;
    }
    setMagnetEnd(){
        Player.player._magnet = false;
        this.magnetSprite.node.active = false;
    }
    //显示护盾
    setProtectStart(){
        Player.player._protecting = true;
        this.protectSprite.node.active = true;
    }
    setProtectEnd(){
        Player.player._protecting = false;
        this.protectSprite.node.active = false;
    }

    //双倍火力
    setDoubleFireStart(){
        Player.player._doubleFire = true;
    }
    setDoubleFireEnd(){
        Player.player._doubleFire = false;
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