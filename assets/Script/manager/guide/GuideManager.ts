import {IMediator} from "../../framework/mvc/IMediator";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";
import {GuideConfig} from "../../configs/GuideConfig";
import Game = cc.Game;
import {Player} from "../../classes/Player";

export class GuideManager implements IMediator{
    private static guideManager:GuideManager = null;
    public static instance(): GuideManager {
        if(this.guideManager==null){
            this.guideManager = new GuideManager();
        }
        return this.guideManager;
    }

    public init(){
        ObserverManager.registerObserverFun(this);
    }

    getCommands() {
        return [GameEvent.GUIDE_TRIGGER_COME_ON_STAGE, GameEvent.ITEM_DROP, GameEvent.SPECIAL_ENEMY_APPEAR];
    }

    private doTrigger(triggerType:string, ...par){
        let triggerList:any[] = null;
        let resultList:any[] = null;
        for(let key in GuideConfig.guideConfig){
            if(Player.player.checkGuideFinish(""+key)){
                console.log(key)
                continue;
            }
            let bTrigger:boolean = true;
            triggerList = GuideConfig.guideConfig[key].trigger;
            resultList = GuideConfig.guideConfig[key].result;
            for (let i in triggerList){
                if(triggerList[i].checkTrigger(triggerType, par)==false){
                    bTrigger = false;
                    break;
                }
            }
            if(bTrigger){
                for(let key in resultList){
                    resultList[key].doResult(par);
                }
            }
        }
    }

    private GUIDE_TRIGGER_COME_ON_STAGE(){
        this.doTrigger(GameEvent.GUIDE_TRIGGER_COME_ON_STAGE);
    }

    private ITEM_DROP(itemName:string){
        this.doTrigger(GameEvent.ITEM_DROP, itemName);
    }

    private SPECIAL_ENEMY_APPEAR(enemyID:string){
        this.doTrigger(GameEvent.SPECIAL_ENEMY_APPEAR, enemyID);
    }
}