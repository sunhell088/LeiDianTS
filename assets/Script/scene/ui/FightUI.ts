import {Player} from "../../classes/Player";
import {PlaneConfig} from "../../configs/PlaneConfig";
import ShipSprite from "../../sprites/ShipSprite";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import {CommonUtil} from "../../common/CommonUtil";
import {ItemConfig} from "../../configs/ItemConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class FightUI extends cc.Component{
    //当前等级
    @property(cc.Label)
    gradeLabel :cc.Label =  null;
    //当前距离
    @property(cc.Label)
    distanceLabel :cc.Label=  null;
    //炸弹数目
    @property([cc.Sprite])
    bombList:cc.Sprite[] =[];
    //经验条
    @property(cc.ProgressBar)
    expBar :cc.ProgressBar = null;
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
    updateRecordSpt:cc.Sprite = null

    //升级特效—特效字图片
    @property(cc.Sprite)
    levelUpTitle:cc.Sprite = null;
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

    public static getFightUI(): FightUI {
        return cc.find("Canvas/fightUI").getComponent(FightUI);
    }

    //初始化玩家UI信息
    initUI(){
        this.setGradeLabel(Player.player.getGrade());
        this.setBombCount(Player.player.bomb);
        this.expBar.progress = Player.player.getExp() / PlaneConfig.getExpByLevel(Player.player.getGrade());
        this.goldCount.string = "0";
        this.pauseBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnBombBtn);
        this.bombBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnPauseGame);
        this.backBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnBackGame);
        this.restartBtn.node.on(cc.Node.EventType.TOUCH_END, this.OnRestartGame);
    }

    //刷新玩家等级
    setGradeLabel(grade){
        this.gradeLabel.string = "LV." + grade;
    }
    //刷新飞行距离
    setDistanceLabel(distance){
        this.distanceLabel.string = distance+"M";
    }


    //刷新拥有炸弹数目
    setBombCount(count){
        for (var k in this.bombList){
            if (k < count){
                this.bombList[k].node.active = true;
            }
            else{
                this.bombList[k].node.active = false;
            }
        }
    }

    //刷新经验条
    setExpBar(percent){
        this.expBar.progress = percent;
    }
    //刷新金币数量
    setGoldLabel(count){
        this.goldCount.string = ""+count;
    }
    //刷新每500M报数
    setDistanceStage(distance,bNewRecord){
        this.distanceStage.node.active = true;
        this.distanceStage.string = distance+"M";
        this.distanceStage.node.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function(sender){sender.node.active = false;})
        ));
        if(bNewRecord){
            this.showUpdateRecord();
        }
    }
    //显示刷新记录图片
    showUpdateRecord(){
        this.updateRecordSpt.node.scale = 8;
        this.updateRecordSpt.node.active = true;
        this.updateRecordSpt.node.runAction(cc.sequence(
            cc.scaleTo(0.2,1),
            GameUtil.shakeBy(0.3,10,5),
            cc.delayTime(2.5),
            GameUtil.getHideSelfCallFun(this.updateRecordSpt.node)
        ));
    }
    //炸弹按钮
    OnBombBtn (sender,type){
        ShipSprite.getShipSprite().onDoubleClick();
    }

    //暂停游戏
    OnPauseGame(sender,type){
        GameUtil.playEffect(SoundConfig.OnclickEffect_mp3);
        //游戏暂停
        cc.director.pause();
        //暂停界面显示
        this.pauseNode.active = true;
        cc.audioEngine.pauseAllEffects();
    }
    //返回游戏
    OnBackGame (sender,type) {
        GameUtil.playEffect(SoundConfig.OnclickEffect_mp3);
        this.pauseNode.active = false;
        cc.director.resume();
        cc.audioEngine.resumeAllEffects();
    }
    //重新开始
    OnRestartGame (sender,type) {
        GameUtil.playEffect(SoundConfig.OnclickEffect_mp3);
        cc.director.resume();
        ShipSprite.getShipSprite().node.stopAllActions();
        FightUI.getFightUI().node.stopAllActions();
        cc.director.loadScene('loginScene');
    }

    //吃道具飘名字
    playShowEatItemName(itemName:string){
        var itemName:string = null;
        switch (itemName) {
            case ItemConfig.itemConfig.item_cc.name:
                itemName = "fly_buff0";
                break;
            case ItemConfig.itemConfig.item_doubleFire.name:
                itemName = "fly_buff4";
                break;
            case ItemConfig.itemConfig.item_xts.name:
                itemName = "fly_buff1";
                break;
            case ItemConfig.itemConfig.item_down_skill.name:
                itemName = "fly_buff5";
                break;
        }
        this.showEatItemName.spriteFrame = this.showEatItemNameAtlas.getSpriteFrame(itemName);
        this.showEatItemName.node.active = true;
        this.showEatItemName.node.scaleX = 2;
        var playerPos:cc.Vec2 = ShipSprite.getShipSprite().node.getPosition();
        this.showEatItemName.node.setPosition(playerPos.x, playerPos.y + this.showEatItemName.node.height*1.5);
        //超过屏幕边界修正过来
        CommonUtil.pClamp(this.showEatItemName);
        this.showEatItemName.node.runAction(cc.sequence(
            cc.scaleTo(0.1, 1.2),
            cc.scaleTo(0.2, 1),
            cc.delayTime(0.4),
            cc.scaleTo(0.2, 2, 0),
            cc.callFunc(function(sender){ sender.node.active = false;})
        ));
    }
}