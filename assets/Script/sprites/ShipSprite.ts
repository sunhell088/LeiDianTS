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
    shipSprite:cc.Sprite = null;
    //机身
    @property(cc.SpriteAtlas)
    shipSpriteAtlas:cc.Sprite = null;
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
    //冲刺前爆炸动画
    @property(cc.Sprite)
    spurtExplodeSprite:cc.Sprite = null;
    @property(cc.Node)
    eatItemEffect:cc.Node = null;

    getCommands():string[] {
        return [GameEvent.UP_GRADE, GameEvent.RESTART_GAME, GameEvent.GAME_OVER, GameEvent.ITEM_COLLISION_PLAYER,
            GameEvent.ROCK_COLLISION_PLAYER];
    }
    
    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
    }
    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
    }
    //重置飞机能力
    resetEffect(){
        this.setMagnet(false);
        Player.player._doublePower = false;
        Player.player._doubleFire = false;
        this.setProtect(false);
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
    //更换飞机
    changePlane(planeConfig){
        this.node.runAction(cc.sequence(
            //更换图片（赋予新飞机的功能）
            cc.callFunc(function(){
                this.resetEffect();
                let frame = this._spriteAtlas.getSpriteFrame(planeConfig.fightTextureName);
                this.shipSprite.getComponent(cc.Sprite).spriteFrame = frame;
                Player.player.data.currentPlaneID = planeConfig.id;
                planeConfig.planeFunction(this);
                ObserverManager.sendNotification(GameEvent.CHANGE_PLANE);
            }, this),
            //登场
            cc.callFunc(this.comeOnStage,this)
        ));

    }
    //显示护盾
    setProtect(state:boolean){
        Player.player._protecting = state;
        this.protectSprite.node.active = state;
    }

    //显示磁铁
    setMagnet(state:boolean){
        Player.player._magnet = state;
        this.magnetSprite.node.active = state;
    }

    destroyShipSprite(){
        this.node.active = false;
    }

    hurt(){
        if(Player.player._invincible||Player.player.debugMode) return;
        //是否在护盾状态下
        if(Player.player._protecting){
            GameUtil.playSound(SoundConfig.shield);  //音效
            ObserverManager.sendNotification(GameEvent.PROTECT_EFFECT);
            this.protectSprite.node.stopAllActions()
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

    eatItem(itemSprite:ItemSprite){
        // itemSprite._itemConfig.itemFunction(); TODO
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
        if(itemSprite._bAttracting) return;
        itemSprite.node.stopAllActions();
        let moveTo = cc.moveTo(0.1, new cc.Vec2(this.node.x, this.node.y));
        itemSprite.node.runAction(cc.sequence(
            moveTo,
            cc.callFunc(itemSprite.destroy, itemSprite),
            cc.callFunc(this.eatItem, this, itemSprite)
        ));

        itemSprite._bAttracting = true;
    }

    getPlayerSprintExplodeAnimation(){
        // this.playerSprintExplode.active = true;
        // this.playerSprintExplode.getComponent(cc.Animation).play();
        return new cc.ActionInterval;
    }

    playEatItemEffectAnimation(){
        this.eatItemEffect.getComponent(cc.Animation).play();
    }

    //升级动画
    private levelUpAnimation() {

    }

    //--------游戏事件监听方法---------
    private UP_GRADE(grade:number){
        this.levelUpAnimation();
    }

    private RESTART_GAME(){
        this.node.stopAllActions();
    }

    private GAME_OVER(){
        this.node.stopAllActions();
    }

    private ITEM_COLLISION_PLAYER(itemSprite:ItemSprite) {
        if (Player.player._magnet) {
            this.attractItem(itemSprite);
        } else {
            this.eatItem(itemSprite);
        }
    }

    private ROCK_COLLISION_PLAYER(){
        this.hurt();
    }
}