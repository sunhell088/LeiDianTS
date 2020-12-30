import {GuideTriggerEvent} from "../../common/GuideTriggerEvent";

//登场触发器
export class GuideTriggerComeOnStage {
    private triggerType:string = GuideTriggerEvent.GUIDE_COME_ON_STAGE;
    checkTrigger(...par):boolean {
        let triggerType:string = par[0];
        return triggerType==this.triggerType
    }
}
//死亡触发器
export class GuideTriggerDead {
    private triggerType:string = GuideTriggerEvent.GUIDE_DEAD;
    checkTrigger(...par):boolean {
        let triggerType:string = par[0];
        return triggerType==this.triggerType
    }
}
export class GuideTriggerEnemyAppear {
    private triggerType:string = GuideTriggerEvent.GUIDE_ENEMY_APPEAR;
    private readonly enemyName:string = null;
    constructor(enemyName:string) {
        this.enemyName = enemyName;
    }
    checkTrigger(...par):boolean {
        let triggerType:string = par[0];
        let enemyName:string = par[1];
        return triggerType==this.triggerType&&enemyName==this.enemyName
    }
}

export class GuideTriggerRockAppear {
    private triggerType:string = GuideTriggerEvent.GUIDE_ROCK_APPEAR;

    checkTrigger(...par):boolean {
        let triggerType:string = par[0];
        return triggerType==this.triggerType;
    }
}
