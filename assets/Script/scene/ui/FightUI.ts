import {Player} from "../../classes/Player";
import ShipSprite from "../../sprites/ShipSprite";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonUtil} from "../../common/CommonUtil";
import {ItemConfig} from "../../configs/ItemConfig";
import {IMediator} from "../../framework/mvc/IMediator";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";
import {ConfigUtil} from "../../common/ConfigUtil";
import CanvasNode from "../CanvasNode";
import {CommonConfig} from "../../configs/CommonConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class FightUI extends cc.Component implements IMediator{
    //当前等级
    @property(cc.Label)
    gradeLabel :cc.Label =  null;
    //当前距离
    @property(cc.Label)
    distanceLabel :cc.Label=  null;
    //炸弹数目
    @property([cc.Sprite])
    bombList:cc.Sprite[] =[];
    //金币数量
    @property(cc.Label)
    goldCount :cc.Label =  null;
    //每500米报数
    @property(cc.Label)
    distanceStage :cc.Label =  null;
    //炸弹按钮
    @property(cc.Button)
    bombBtn :cc.Button = null;
    //暂停按钮
    @property(cc.Button)
    pauseBtn :cc.Button = null;
    //暂停界面
    @property(cc.Node)
    pauseNode : cc.Node = null;
    //返回游戏按钮
    @property(cc.Button)
    backBtn :cc.Button = null;
    //重新开始按钮
    @property(cc.Button)
    restartBtn :cc.Button = null;

    //新记录图片
    @property(cc.Sprite)
    newRecordSpt:cc.Sprite = null;
    //刷新记录图片
    @property(cc.Sprite)
    updateRecordSpt:cc.Sprite = null;

    //升级特效
    @property(cc.Node)
    levelUpEffectNode:cc.Node = null;
    //升级特效—人物图片
    @property(cc.Sprite)
    levelUpMan:cc.Sprite = null;
    @property([cc.SpriteFrame])
    levelUpManSpriteFrame:cc.SpriteFrame[] = [];

    //商城道具图片（用于开局使用时给效果）
    @property(cc.Sprite)
    storeItemSpurt:cc.Sprite = null;
    @property(cc.Sprite)
    storeItemRevive:cc.Sprite = null;
    @property(cc.Sprite)
    storeItemDeath:cc.Sprite = null;
    @property(cc.Sprite)
    storeItemChange:cc.Sprite = null;
    //吃功能道具飘名字
    @property(cc.SpriteAtlas)
    showEatItemNameAtlas:cc.SpriteAtlas = null;
    @property(cc.Sprite)
    showEatItemName:cc.Sprite = null;
    @property(cc.Prefab)
    eatCoinEffectPrefab:cc.Prefab = null;

    private eatCoinEffectPool: cc.NodePool = new cc.NodePool();

    getCommands():string[] {
        return [GameEvent.SET_BOMB, GameEvent.SET_CURRENT_REWARD_GOLD,
            GameEvent.RESTART_GAME, GameEvent.MOVE_BG, GameEvent.STORE_ITEM_EFFECT, GameEvent.UPDATE_DISTANCE_STAGE,
            GameEvent.ITEM_COLLISION_PLAYER];
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
        this.pauseBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnPauseGame, this);
        this.bombBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnBombBtnClick, this);
        this.backBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnBackGame, this);
        this.restartBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnRestartGame, this);
        this.init();
    }

    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
        this.pauseBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnPauseGame, this);
        this.bombBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnBombBtnClick, this);
        this.backBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnBackGame, this);
        this.restartBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnRestartGame, this);
    }

    //初始化玩家UI信息
    private init(){
        this.setGradeLabel(Player.player.getBulletGrade());
        this.setBombCount(Player.player.bomb);
        this.goldCount.string = "0";
    }

    //刷新玩家等级
    private setGradeLabel(grade){
        this.gradeLabel.string = "" + grade;
    }
    //刷新飞行距离
    private setDistanceLabel(distance){
        this.distanceLabel.string = distance+"M";
    }


    //刷新拥有炸弹数目
    private setBombCount(count){
        for (let k in this.bombList){
            if (k < count){
                this.bombList[k].node.active = true;
            }
            else{
                this.bombList[k].node.active = false;
            }
        }
    }
    //显示刷新记录图片
    private showUpdateRecord(){
        this.updateRecordSpt.node.scale = 8;
        this.updateRecordSpt.node.active = true;
        this.updateRecordSpt.node.runAction(cc.sequence(
            cc.scaleTo(0.2,1),
            GameUtil.shakeBy(0.3,10,5),
            cc.delayTime(2.8),
            GameUtil.getHideSelfCallFun(this.updateRecordSpt.node)
        ));
    }
    //炸弹按钮
    private OnBombBtnClick (sender, type){
        // ObserverManager.sendNotification(GameEvent.USE_BOMB);
        ObserverManager.sendNotification(GameEvent.EAT_ITEM_NAME_FLY_OVER, ItemConfig.itemConfig.item_cc);
    }

    //暂停游戏
    private OnPauseGame(sender,type){
        GameUtil.playSound(SoundConfig.OnclickEffect_mp3);
        //游戏暂停
        cc.director.pause();
        //暂停界面显示
        this.pauseNode.active = true;
        cc.audioEngine.pauseAllEffects();
    }
    //返回游戏
    private OnBackGame (sender,type) {
        GameUtil.playSound(SoundConfig.OnclickEffect_mp3);
        this.pauseNode.active = false;
        cc.director.resume();
        cc.audioEngine.resumeAllEffects();
    }
    //重新开始
    private OnRestartGame (sender,type) {
        ObserverManager.sendNotification(GameEvent.RESTART_GAME);
        GameUtil.playSound(SoundConfig.OnclickEffect_mp3);
        cc.director.resume();
        this.node.stopAllActions();
        cc.director.loadScene('loginScene');
    }

    //吃道具飘名字
    private playShowEatItemName(itemConfigName:string){
        let itemConfigObj:any = null;
        switch (itemConfigName) {
            case ItemConfig.itemConfig.item_cc.name:
                itemConfigObj = ItemConfig.itemConfig.item_cc;
                break;
            case ItemConfig.itemConfig.item_xts.name:
                itemConfigObj = ItemConfig.itemConfig.item_xts;
                break;
            case ItemConfig.itemConfig.item_protect.name:
                itemConfigObj = ItemConfig.itemConfig.item_protect;
                break;
            case ItemConfig.itemConfig.item_shadow.name:
                itemConfigObj = ItemConfig.itemConfig.item_shadow;
                break;
            case ItemConfig.itemConfig.item_double.name:
                itemConfigObj = ItemConfig.itemConfig.item_double;
                break;
            case ItemConfig.itemConfig.item_coin.name:
                itemConfigObj = ItemConfig.itemConfig.item_coin;
                break;
            case ItemConfig.itemConfig.item_red.name:
                itemConfigObj = ItemConfig.itemConfig.item_red;
                break;
            case ItemConfig.itemConfig.item_green.name:
                itemConfigObj = ItemConfig.itemConfig.item_green;
                break;
        }

        if(itemConfigObj.gold==null){
            this.showEatItemName.node.stopAllActions();
            this.showEatItemName.spriteFrame = this.showEatItemNameAtlas.getSpriteFrame(itemConfigObj.effectTexture);
            this.showEatItemName.node.active = true;
            this.showEatItemName.node.scaleX = 2;
            var playerPos:cc.Vec2 = CanvasNode.getCanvasNode().getShipNodePos();
            this.showEatItemName.node.setPosition(playerPos.x, playerPos.y);
            //超过屏幕边界修正过来
            CommonUtil.pClamp(this.showEatItemName.node);
            ObserverManager.sendNotification(GameEvent.EAT_ITEM_NAME_FLY_OVER, itemConfigObj)
            this.showEatItemName.node.runAction(cc.sequence(
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.2, 1),
                cc.delayTime(1),
                cc.scaleTo(0.2, 2, 0),
                cc.callFunc(function(){
                    this.showEatItemName.node.active = false;
                    },this)
            ));
        }else{
            let eatCoinNameNode:cc.Node = this.createEatCoinEffect(itemConfigObj.effectTexture);
            let playerPos:cc.Vec2 = CanvasNode.getCanvasNode().getShipNodePos();
            eatCoinNameNode.setPosition(playerPos.x, playerPos.y);
            eatCoinNameNode.runAction(cc.sequence(
                cc.delayTime(1),
                cc.blink(0.5,2),
                cc.callFunc(function(){
                    this.eatCoinEffectPool.put(eatCoinNameNode);},this))
            );
        }
    }
    //创建子弹击中效果复用对象
    private createEatCoinEffect(itemConfigTextureName:string): cc.Node {
        let spriteNode:cc.Node = null;
        if (this.eatCoinEffectPool.size() > 0) {
            spriteNode = this.eatCoinEffectPool.get();
            spriteNode.opacity = 255;
            spriteNode.stopAllActions();
        } else {
            spriteNode = cc.instantiate(this.eatCoinEffectPrefab);
        }
        let sprite:cc.Sprite = spriteNode.getComponent(cc.Sprite);
        sprite.spriteFrame = this.showEatItemNameAtlas.getSpriteFrame(itemConfigTextureName);
        this.node.addChild(spriteNode);
        return spriteNode;
    }
    //--------游戏事件监听方法---------

    private SET_BOMB(count:number){
        this.setBombCount(count);
    }

    private SET_CURRENT_REWARD_GOLD(count:number){
        this.goldCount.string = ""+count;
    }

    private RESTART_GAME(){
        this.node.stopAllActions();
    }

    public MOVE_BG(currentDistance:number){
        this.setDistanceLabel(currentDistance)
    }

    private STORE_ITEM_EFFECT(storeItemConfig:any, shipSprite:ShipSprite){
        //出现道具图标
        var storeItemIcon = this.storeItemRevive;
        storeItemIcon.node.setPosition(0, 0);
        storeItemIcon.node.scale = 8;
        storeItemIcon.node.runAction(cc.sequence(
            cc.callFunc(function(){
                storeItemIcon.node.active = true
            }),
            cc.scaleTo(0.2,1),
            GameUtil.shakeBy(0.3,10,5),
            cc.delayTime(0.5),
            GameUtil.getHideSelfCallFun(storeItemIcon.node),
            cc.callFunc(function(){
                shipSprite.revive();
                shipSprite.changePlane(ConfigUtil.getPlaneConfig(Player.player._revivePlaneID));
                Player.player._revivePlaneID = 0;
            }),
            cc.delayTime(1),
            cc.callFunc(function(){
                Player.player._changePlaneIng = false;
            })
        ));
    }

    private UPDATE_DISTANCE_STAGE(){
        var bNewRecord = Player.player.currentDistance>CommonConfig.NEW_RECORD_DISTANCE
            &&Player.player.currentDistance>Player.player.data.maxDistance+CommonConfig.DISTANCE_STAGE_UNIT;
        let distance = Player.player._preDistanceStage*CommonConfig.DISTANCE_STAGE_UNIT
        //刷新每500M报数
        this.distanceStage.node.active = true;
        this.distanceStage.string = distance+"M";
        this.distanceStage.node.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function(sender){
                sender.active = false;
                },this.distanceStage)
        ));
        if(bNewRecord){
            this.showUpdateRecord();
        }
    }

    private ITEM_COLLISION_PLAYER(itemConfig:any){
        this.playShowEatItemName(itemConfig.name);
    }
}