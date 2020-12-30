import {
    GuideResultPauseGame,
    GuideResultDialog,
    GuideResultFinishGuide
} from "../manager/guide/GuideResult";
import {GuideTriggerEvent} from "../common/GuideTriggerEvent";

export class GuideConfig {

    public static guideConfig = {
        comeOnStage:{
            name:"comeOnStage",
            trigger:GuideTriggerEvent.GUIDE_COME_ON_STAGE,
            condition:[],
            result:[
                new GuideResultDialog("dialogComeOnStage01"),
                new GuideResultPauseGame(),
                new GuideResultFinishGuide("comeOnStage")
            ]
        },
        deadNotFinish:{
            name:"deadNotFinish",
            trigger:GuideTriggerEvent.GUIDE_DEAD,
            condition:[],
            result:[
                new GuideResultDialog("dialogDeadNotFinish01"),
                new GuideResultPauseGame(),
                new GuideResultFinishGuide("deadNotFinish")
            ]
        }
    };
}
