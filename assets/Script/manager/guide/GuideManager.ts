import {GuideConfig} from "../../configs/GuideConfig";
import {Player} from "../../classes/Player";

export class GuideManager{
    private static guideManager:GuideManager = null;
    public static instance(): GuideManager {
        if(this.guideManager==null){
            this.guideManager = new GuideManager();
        }
        return this.guideManager;
    }

    public doTrigger(triggerType:string, ...par){
        for(let key in GuideConfig.guideConfig){
            if(Player.player.hasFinishGuide(GuideConfig.guideConfig[key].name)){
                continue;
            }
            //判断触发事件
            if(GuideConfig.guideConfig[key].trigger==triggerType){
                //判断是否满足条件队列
                let conditionList:any[] = GuideConfig.guideConfig[key].condition;
                let bCondition:boolean = true;
                for(let key in conditionList){
                    if(!conditionList[key].checkCondition(par)){
                        bCondition = false;
                        break;
                    }
                }
                //执行结果队列
                if(bCondition){
                    let resultList:any[] = GuideConfig.guideConfig[key].result;
                    for(let key in resultList){
                        resultList[key].doResult(par);
                    }
                }
            }
        }
    }
}