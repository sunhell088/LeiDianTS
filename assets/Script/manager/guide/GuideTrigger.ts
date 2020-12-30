import {GameEvent} from "../../common/GameEvent";

//登场触发器
export class GuideTriggerComeOnStage {
    private triggerType:string = GameEvent.GUIDE_TRIGGER_COME_ON_STAGE;
    checkTrigger(...par):boolean {
        let triggerType:string = par[0];
        return triggerType==this.triggerType
    }
}

export class GuideTriggerEnemyAppear {
    private triggerType:string = GameEvent.SPECIAL_ENEMY_APPEAR;
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

export class GuideTriggerItemDrop {
    private triggerType:string = GameEvent.ITEM_DROP;
    private readonly itemName:string = null;
    constructor(itemName:string) {
        this.itemName = itemName;
    }
    checkTrigger(...par):boolean {
        let triggerType:string = par[0];
        let itemName:string = par[1];
        return triggerType==this.triggerType&&itemName==this.itemName
    }
}