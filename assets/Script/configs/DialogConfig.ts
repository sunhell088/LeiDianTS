import {DialogManager} from "../manager/widget/DialogManager";
import {Player} from "../classes/Player";
import {GuideConfig} from "./GuideConfig";
import {SceneManager} from "../manager/scene/SceneManager";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";
import {EnemyConfig} from "./EnemyConfig";
import {ItemConfig} from "./ItemConfig";

export class DialogConfig {
    public static dialogConfig = {
        //---开场白
        dialogComeOnStage01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    欢迎来到一个新世界，这款与你以前玩的飞行射击游戏都不一样!",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogComeOnStage02");
            }
        },
        dialogComeOnStage02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这个游戏需要你的灵活的策略和审时度势来灵活应对。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogComeOnStage03");
            }
        },
        dialogComeOnStage03:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    多说无益，现在让我们开始吧！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                Player.player.guideFinish(GuideConfig.guideConfig.comeOnStage.name);
            }
        },
        //----------没完成新手引导就死亡了
        dialogDeadNotFinish01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    你还需要多加练习。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogDeadNotFinish02");
            }
        },
        dialogDeadNotFinish02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    让我们再来一次吧。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                SceneManager.instance().changeScene("fightScene");
            }
        },
        //----宝箱飞机出现
        dialogBlessEnemy01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    宝藏敌机出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogBlessEnemy02");
            }
        },
        dialogBlessEnemy02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    快快击落它，获得能力增强道具!",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemyBox.id);
                Player.player.guideFinish(GuideConfig.guideConfig.blessEnemy.name);
            }
        },
        //----追踪飞机出现
        dialogFollowEnemy01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    小心，自动追踪敌机出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogFollowEnemy02");
            }
        },
        dialogFollowEnemy02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    随后它会冲向你，注意躲避。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemyBox.id);
                Player.player.guideFinish(GuideConfig.guideConfig.followEnemy.name);
            }
        },
        //----自爆飞机出现
        dialogBombEnemy01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    自爆飞机出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogBombEnemy02");
            }
        },
        dialogBombEnemy02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    击爆它将引爆其他敌机。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemyBomb.id);
                Player.player.guideFinish(GuideConfig.guideConfig.bombEnemy.name);
            }
        },
        //----停留飞机出现
        dialogStayEnemy01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    重装飞机出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogStayEnemy02");
            }
        },
        dialogStayEnemy02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    击爆它将获得大量奖励。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogStayEnemy03");
            }
        },
        dialogStayEnemy03:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    但重装飞机血量很厚，现在请不要恋战！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                Player.player.guideFinish(GuideConfig.guideConfig.stayEnemy.name);
                Player.player.guideFinish(GuideConfig.guideConfig.stayEnemy2.name);
            }
        },
        //----陨石出现
        dialogRock01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    陨石出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogRock02");
            }
        },
        dialogRock02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    陨石无法击破，请注意闪避！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                Player.player.guideFinish(GuideConfig.guideConfig.rockAppear.name);
            }
        },
        //----宝箱飞机再次出现
        dialogBlessEnemy21:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    宝藏敌机再次出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogBlessEnemy22");
            }
        },
        dialogBlessEnemy22:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这次一定不能放过它!",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemyBox.id);
                Player.player.guideFinish(GuideConfig.guideConfig.blessEnemy2.name);
            }
        },
        //----追踪飞机再次出现
        dialogFollowEnemy21:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    追踪敌机又出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogFollowEnemy22");
            }
        },
        dialogFollowEnemy22:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这次请击落它。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemyFollow.id);
                Player.player.guideFinish(GuideConfig.guideConfig.followEnemy2.name);
            }
        },
        //----自爆飞机再次出现
        dialogBombEnemy21:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    自爆飞机很脆弱！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogBombEnemy22");
            }
        },
        dialogBombEnemy22:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    争取优先击爆它吧！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemyBomb.id);
                Player.player.guideFinish(GuideConfig.guideConfig.bombEnemy2.name);
            }
        },
        //----提示每次有1级脆皮飞机
        dialogMinLevelEnemy0:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    在每一波飞机队列中，都会有部分最低级飞机",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogMinLevelEnemy01");
            }
        },
        dialogMinLevelEnemy01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    击破它们，作为突破口吧！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemy0.id);
                Player.player.guideFinish(GuideConfig.guideConfig.minLevelEnemyOver1.name);
            }
        },
        //----再次提示每次有1级脆皮飞机
        dialogMinLevelEnemyOver:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    切记每波的低级飞机是突破口。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogMinLevelEnemyOver01");
            }
        },
        dialogMinLevelEnemyOver01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这样可以使你更游刃有余！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ENEMY, EnemyConfig.enemyConfig.enemy0.id);
                Player.player.guideFinish(GuideConfig.guideConfig.minLevelEnemyOver2.name);
            }
        },
        //--------敌机的新手指引完成
        finishGuideEnemy:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    现在敌机已经很强大了。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("finishGuideEnemy2");
            }
        },
        finishGuideEnemy2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    让我们来升级下火力吧",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                SceneManager.instance().changeScene("storeScene");
                Player.player.guideFinish(GuideConfig.guideConfig.deadMinLevelFinish.name);
            }
        },
        //--------道具吸铁石指引---
        dialogItemXTS:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这是磁石。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogItemXTS2");
            }
        },
        dialogItemXTS2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    获取后，可拥有自动吸引金币和道具功能！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ITEM, ItemConfig.itemConfig.item_xts.name);
                Player.player.guideFinish(GuideConfig.guideConfig.itemXTS.name);
            }
        },
        //护盾指引
        dialogItemProtect:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这是护盾。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogItemProtect2");
            }
        },
        dialogItemProtect2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    获取后，可拥有防御一次敌机或陨石撞击！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ITEM, ItemConfig.itemConfig.item_protect.name);
                Player.player.guideFinish(GuideConfig.guideConfig.itemProtect.name);
            }
        },
        //双倍火力指引
        dialogItemDouble:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这是双倍火力。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogItemDouble2");
            }
        },
        dialogItemDouble2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    获取后，可拥有双倍火力！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ITEM, ItemConfig.itemConfig.item_double.name);
                Player.player.guideFinish(GuideConfig.guideConfig.itemDouble.name);
            }
        },
        //影子传说指引
        dialogItemShadow:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这是影子传说。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogItemShadow2");
            }
        },
        dialogItemShadow2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    获取后，可拥有一个如影随形！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ITEM, ItemConfig.itemConfig.item_shadow.name);
                Player.player.guideFinish(GuideConfig.guideConfig.itemShadow.name);
            }
        },
        //炸弹指引
        dialogItemBomb:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这是炸弹。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogItemBomb2");
            }
        },
        dialogItemBomb2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    获取后，双击屏幕即可使用全屏炸弹！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
                ObserverManager.sendNotification(GameEvent.FOCUS_ITEM, ItemConfig.itemConfig.item_bomb.name);
                Player.player.guideFinish(GuideConfig.guideConfig.itemBomb.name);
            }
        }
    }
}