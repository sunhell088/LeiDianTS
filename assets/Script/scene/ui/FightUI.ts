import {IMediator} from "../../framework/mvc/IMediator";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";
import {Player} from "../../classes/Player";
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
    @property(cc.BitmapFont)
    levelUpTitle:cc.BitmapFont = null;
    //升级特效—人物图片
    @property(cc.Sprite)
    levelUpMan:cc.Sprite = null;

    //商城道具图片（用于开局使用时给效果）
    @property(cc.Sprite)
    storeItemSpurt:cc.Sprite = null;
    @property(cc.Sprite)
    storeItemRevive:cc.Sprite = null;
    @property(cc.Sprite)
    storeItemDeath:cc.Sprite = null;
    @property(cc.Sprite)
    storeItemChange:cc.Sprite = null;

    public static getFightUI(): FightUI {
        return cc.find("Canvas/fightUI").getComponent(FightUI);
    }

    getCommands():string[] {
        return [GameEvent.ADD_BOMB, GameEvent.ADD_EXP, GameEvent.UP_GRADE, GameEvent.USE_BOMB, GameEvent.ADD_CURRENT_REWARD_GOLD,
        GameEvent.MOVE_BG, GameEvent.NEW_RECORD];
    }

    //初始化玩家UI信息
    initUI(){
        // if(this.debugMode) return;
        // this.setGradeLable(g_player.getGrade());
        // this.setBombCount(g_player.bomb);
        // this._expBar.setPercent(Math.round(g_player.getExp() / VVV.getExpByLevel(g_player.getGrade()) * 100));
        // this._goldCount.setString(0);
        // this._bombBtn.addTouchEventListener(this.OnBombBtn, this);
        // this._pauseBtn.addTouchEventListener(this.OnPauseGame, this);
        // this._backBtn.addTouchEventListener(this.OnBackGame, this);
        // this._restartBtn.addTouchEventListener(this.OnRestartGame, this);
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
        this.pauseBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.loadScene('loginScene');
        });
        this.bombBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            Player.player.addExp(100);
        });
    }

    onDestroy():void {
        console.log("fightUI onDestroy")
    }
    onAddBomb(count:number){
        console.log("fightUI onAddBomb "+count);
        // g_FightUILayer.setBombCount(this.bomb);
    }

    onAddExp(grade:number, expPersents:number){
        // console.log("fightUI onAddExp "+grade+"=="+expPersents);
        // g_FightUILayer.setGradeLable(this.getGrade());
        // g_FightUILayer.setExpBar();
    }

    onUpGrade(grade:number){
        console.log("fightUI onUpGrade "+grade);
        // g_FightUILayer.setGradeLable(this.getGrade(planeID));
    }

    onUseBomb(bombCount:number) {
        console.log("fightUI onUseBomb ");
        // g_FightUILayer.setBombCount(this.bomb);
    }

    onAddCurrentRewardGold(currentRewardGold:number) {
        console.log("fightUI onAddCurrentRewardGold ");
        // g_FightUILayer.setGoldLabel(this.currentRewardGold);
    }

    onMoveBG(tempForRound){
        // g_FightUILayer.setDistanceLable(tempForRound);
        // var bNewRecord = Player.player.currentDistance>CommonConfig.NEW_RECORD_DISTANCE
        //     &&Player.player.currentDistance>Player.player.data.maxDistance+CommonConfig.DISTANCE_STAGE_UNIT;
        // g_FightUILayer.setDistanceStage(Player.player._preDistanceStage*CommonConfig.DISTANCE_STAGE_UNIT, bNewRecord);
    }

    onNewRecord(tempForRound){
        // g_FightUILayer.showUpdateRecord();
        // g_FightUILayer.setDistanceStage(tempForRound);

        // //是否刷新了老记录
        // if(Player.player.currentDistance>Player.player.data.maxDistance
        //     &&Player.player.data.maxDistance>0
        //     &&!Player.player._alreadyShowUpdateRecord
        //     &&Player.player.currentDistance>CommonConfig.NEW_RECORD_DISTANCE)
        // {
        //     Player.player._alreadyShowUpdateRecord = true;
        //
        //     g_FightUILayer.showUpdateRecord();
        //     g_FightUILayer.setDistanceStage(tempForRound);
        // }
    }
}