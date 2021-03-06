import {Player} from "../../classes/Player";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonUtil} from "../../common/CommonUtil";
import {ItemConfig} from "../../configs/ItemConfig";
import {IMediator} from "../../framework/mvc/IMediator";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";
import CanvasNode from "../CanvasNode";
import {CommonConfig} from "../../configs/CommonConfig";
import {ConfigUtil} from "../../common/ConfigUtil";
import {SceneManager} from "../../manager/scene/SceneManager";
import {DialogManager} from "../../manager/widget/DialogManager";
import {GuideConfig} from "../../configs/GuideConfig";
import {GuideManager} from "../../manager/guide/GuideManager";
import {GuideTriggerEvent} from "../../common/GuideTriggerEvent";
import log = cc.log;

const {ccclass, property} = cc._decorator;
@ccclass
export default class FightUI extends cc.Component implements IMediator{
    //当前距离
    @property(cc.Label)
    distanceLabel :cc.Label=  null;
    //金币数量
    @property(cc.Label)
    goldCount :cc.Label =  null;
    //每500米报数
    @property(cc.Label)
    distanceStage :cc.Label =  null;
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

    //吃功能道具飘名字
    @property(cc.SpriteAtlas)
    showEatItemNameAtlas:cc.SpriteAtlas = null;
    @property(cc.Sprite)
    showEatItemName:cc.Sprite = null;
    @property(cc.Prefab)
    eatCoinEffectPrefab:cc.Prefab = null;

    @property(cc.Sprite)
    progressBarSpt:cc.Sprite = null;
    @property(cc.Sprite)
    progressRoleSpt:cc.Sprite = null;
    @property([cc.SpriteFrame])
    progressRoleSptFrame:cc.SpriteFrame[] = [];

    @property(cc.ProgressBar)
    shadowProgress:cc.ProgressBar = null;
    @property(cc.ProgressBar)
    magnetProgress:cc.ProgressBar = null;
    @property(cc.ProgressBar)
    protectProgress:cc.ProgressBar = null;
    @property(cc.ProgressBar)
    doubleFireProgress:cc.ProgressBar = null;
    @property(cc.Label)
    shadowCountLab:cc.Label = null;
    //炸弹图标
    @property([cc.Node])
    bombBuffList:cc.Node[] = [];
    @property(cc.Node)
    doubleClickHint: cc.Node = null;

    private eatCoinEffectPool: cc.NodePool = new cc.NodePool();
    //双击状态
    private _clicked:boolean = false;
    getCommands(){
        return [GameEvent.RESTART_GAME, GameEvent.MOVE_BG, GameEvent.UPDATE_DISTANCE_STAGE,
            GameEvent.ITEM_COLLISION_PLAYER, GameEvent.UPDATE_FIGHT_GOLD, GameEvent.EAT_ITEM, GameEvent.DEDUCT_BUFF_TIME
        ,GameEvent.PROTECT_EFFECT, GameEvent.USE_BOMB_EFFECT, GameEvent.OPEN_DOUBLE_CLICK_HINT];
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
        this.doubleClickHint.on(cc.Node.EventType.TOUCH_END, this.onDoubleClickHint, this);
        this.pauseBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnPauseGame, this);
        this.backBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnBackGame, this);
        this.restartBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnRestartGame, this);
        this.schedule(Player.player.saveData, 1);
        this.init();
    }

    protected onDisable():void {
        ObserverManager.unRegisterObserverFun(this);
        this.pauseBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnPauseGame, this);
        this.backBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnBackGame, this);
        this.restartBtn.node.off(cc.Node.EventType.TOUCH_END, this.OnRestartGame, this);
        this.unschedule(Player.player.saveData);
    }

    //初始化玩家UI信息
    private init(){
        this.doubleClickHint.active = false;
        this.goldCount.string = "0";
        this.progressRoleSpt.node.runAction(cc.repeatForever(cc.blink(1, 1)))
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID)
        this.progressRoleSpt.spriteFrame = this.progressRoleSptFrame[planeConfig.nameIndex];
        this.shadowProgress.node.parent.active = false;
        this.magnetProgress.node.parent.active = false;
        this.protectProgress.node.parent.active = false;
        this.doubleFireProgress.node.parent.active = false;
        this.shadowCountLab.node.active = false;
        for(let i=0;i<this.bombBuffList.length;i++){
            this.bombBuffList[i].active = false;
        }
    }

    //刷新飞行距离
    private setDistanceLabel(distance){
        this.distanceLabel.string = distance+"M";
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

    private onDoubleClickHint(event){
        if(this._clicked){
            this.doubleClickHint.active = false;
            Player.player.guideFinish(GuideConfig.guideConfig.doubleClickBomb.name);
            ObserverManager.sendNotification(GameEvent.DOUBLE_CLICK_HINT_DO);
        }else{
            this._clicked = true;
            setTimeout(function(){
                let target:FightUI = event.getCurrentTarget().parent.getComponent(FightUI);
                target._clicked = false;
                }, 250);
        }
        return true
    }
    //暂停游戏
    private OnPauseGame(sender,type){
        GameUtil.playSound(SoundConfig.OnclickEffect_mp3);
        this.scheduleOnce(function () {
            cc.director.pause();
        }, 0.1)
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
        GameUtil.playMusic(SoundConfig.mainMusic_mp3+""+CommonUtil.random(0,2));
        SceneManager.instance().changeScene("storeScene");
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
            case ItemConfig.itemConfig.item_bomb.name:
                itemConfigObj = ItemConfig.itemConfig.item_bomb;
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
            ObserverManager.sendNotification(GameEvent.EAT_ITEM, itemConfigObj);
            this.scheduleOnce(function () {
                GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_EAT_ITEM, itemConfigObj.name)
            }, 1)
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
            Player.player.addCurrentRewardGold(itemConfigObj.gold);
            Player.player.addGold(itemConfigObj.gold);
            ObserverManager.sendNotification(GameEvent.UPDATE_FIGHT_GOLD)
            let eatCoinNameNode:cc.Node = this.createEatCoinEffect(itemConfigObj.effectTexture);
            let playerPos:cc.Vec2 = CanvasNode.getCanvasNode().getShipNodePos();
            eatCoinNameNode.setPosition(playerPos.x, playerPos.y);
            eatCoinNameNode.runAction(cc.sequence(
                cc.delayTime(1),
                cc.moveBy(0.5,new cc.Vec2(0,30)).easing(cc.easeIn(3)),
                cc.callFunc(function(){
                    this.eatCoinEffectPool.put(eatCoinNameNode);
                    },this))
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

    private updateBombCount(){
        for(let i=0;i<this.bombBuffList.length;i++){
            this.bombBuffList[i].active = false;
            if(i<=Player.player.bombCount-1){
                this.bombBuffList[i].active = true;
            }
        }
    }
    //--------游戏事件监听方法---------

    private SET_CURRENT_REWARD_GOLD(count:number){
        this.goldCount.string = ""+count;
    }

    private RESTART_GAME(){
        this.node.stopAllActions();
    }

    public MOVE_BG(currentDistance:number){
        this.setDistanceLabel(currentDistance);
        let periodDis:number = currentDistance/CommonConfig.MAX_DISTANCE
        this.progressRoleSpt.node.y = -this.progressBarSpt.node.getContentSize().width/2+this.progressBarSpt.node.getContentSize().width*periodDis;
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

    private UPDATE_FIGHT_GOLD(){
        this.goldCount.string = ""+Player.player.currentRewardGold;
    }

    private EAT_ITEM(itemConfigObj){
        let progressBar:cc.ProgressBar = null;
        switch (itemConfigObj.name) {
            case ItemConfig.itemConfig.item_xts.name:
                progressBar = this.magnetProgress;
                break;
            case ItemConfig.itemConfig.item_protect.name:
                progressBar = this.protectProgress;
                break;
            case ItemConfig.itemConfig.item_shadow.name:
                progressBar = this.shadowProgress;
                break;
            case ItemConfig.itemConfig.item_double.name:
                progressBar = this.doubleFireProgress;
                break;
            case ItemConfig.itemConfig.item_bomb.name:
                if(Player.player.bombCount<CommonConfig.BOMB_MAX_COUNT){
                    Player.player.bombCount++;
                    this.updateBombCount();
                }
                break;
        }
        if(progressBar){
            progressBar.node.parent.active = true;
        }
    }

    private DEDUCT_BUFF_TIME(itemName:string){
        let percent:number = 0;
        let buffProgress:cc.ProgressBar = null;
        switch (itemName) {
            case ItemConfig.itemConfig.item_xts.name:
                percent = Player.player.magnetRemainTime/CommonConfig.MAGNET_TIME;
                buffProgress = this.magnetProgress;
                break;
            case ItemConfig.itemConfig.item_protect.name:
                percent = Player.player.protectRemainTime/CommonConfig.PROTECT_TIME;
                buffProgress = this.protectProgress;
                break;
            case ItemConfig.itemConfig.item_shadow.name:
                percent = Player.player.shadowRemainTime%CommonConfig.SHADOW_TIME/CommonConfig.SHADOW_TIME;
                buffProgress = this.shadowProgress;
                break;
            case ItemConfig.itemConfig.item_double.name:
                percent = Player.player.doubleFireRemainTime/CommonConfig.DOUBLE_FIRE_TIME;
                buffProgress = this.doubleFireProgress;
                break;
        }
        buffProgress.progress = percent;
        if(itemName==ItemConfig.itemConfig.item_shadow.name){
            let shadowCount:number = Player.player.shadowRemainTime/CommonConfig.SHADOW_TIME;
            if(shadowCount>1){
                this.shadowCountLab.node.active = true;
                this.shadowCountLab.string = "x"+Math.ceil(Player.player.shadowRemainTime/CommonConfig.SHADOW_TIME);
            }else {
                this.shadowCountLab.node.active = false;
                if(shadowCount<=0){
                    buffProgress.node.parent.active = false;
                }
            }
        }else {
            if(percent<=0){
                buffProgress.node.parent.active = false;
            }
        }
    }

    private PROTECT_EFFECT(){
        this.protectProgress.node.parent.active = false;
    }

    private USE_BOMB_EFFECT(){
        this.updateBombCount();
    }

    private OPEN_DOUBLE_CLICK_HINT(){
        this.doubleClickHint.active = true;
    }
}