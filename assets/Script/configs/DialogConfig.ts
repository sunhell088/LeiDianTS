import {DialogManager} from "../manager/widget/DialogManager";
import {Player} from "../classes/Player";
import {GuideConfig} from "./GuideConfig";

export class DialogConfig {
    public static dialogConfig = {
        comeOnStage01:{
            name:"comeOnStage01",
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    欢迎来到一个新世界，这款与你以前玩的飞行射击游戏都不一样!",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("comeOnStage02");
            }
        },
        comeOnStage02:{
            name:"comeOnStage02",
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    这个游戏需要你的灵活的策略和审时度势来灵活应对。",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("comeOnStage03");
            }
        },
        comeOnStage03:{
            name:"comeOnStage03",
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    多说无益，现在让我们开始吧！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                Player.player.guideFinish(GuideConfig.guideConfig.comeOnStage.name)
                cc.director.resume();
            }
        },
        //----宝箱飞机出现
        blessEnemy01:{
            name:"blessEnemy01",
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    宝藏敌机出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("blessEnemy02");
            }
        },
        blessEnemy02:{
            name:"blessEnemy02",
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
        followEnemy01:{
            name:"followEnemy01",
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    小心，自动追踪敌机出现了！",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().showDialog("followEnemy02");
            }
        },
        followEnemy02:{
            name:"followEnemy02",
            headIcon:"teacher",
            speakerName:"新手教官:",
            textInfo:"    随后它会冲向你，注意躲避，",
            dialogDirection:true,
            dialogAction:function () {
                DialogManager.instance().closeDialog();
                cc.director.resume();
            }
        }
    }
}