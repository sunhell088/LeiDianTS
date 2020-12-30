import {DialogManager} from "../manager/widget/DialogManager";
import {Player} from "../classes/Player";
import {GuideConfig} from "./GuideConfig";
import {SceneManager} from "../manager/scene/SceneManager";

export class DialogConfig {
    public static dialogConfig = {
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
            }
        },
        //----------没完成新手引导就死亡了
        dialogDeadNotFinish01:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    敌机太强大，机长请多加小心！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogDeadNotFinish02");
            }
        },
        dialogDeadNotFinish02:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    让我们再来一次试试。",
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
            }
        },
        //----每次有1级脆皮飞机
        dialogMinLevelEnemy:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    在每一波飞机队列中，都会有部分最低级飞机",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("dialogMinLevelEnemy1");
            }
        },
        dialogMinLevelEnemy1:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    击破它们，作为突破口吧！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
            }
        },
        //--------敌机的新手指引完成
        finishGuideEnemy:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    恭喜你，已经对敌机的类型有了一定的了解。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("finishGuideEnemy2");
            }
        },
        finishGuideEnemy2:{
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    让我们来了解下道具吧。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
            }
        }
        
    }
}