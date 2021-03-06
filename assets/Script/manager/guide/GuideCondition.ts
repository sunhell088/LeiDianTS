import {Player} from "../../classes/Player";

export class GuideConditionEnemy {
    private readonly enemyID:string = null;
    constructor(enemyID:string) {
        this.enemyID = enemyID;
    }
    checkCondition(...par):boolean {
        let enemyID:string = par[0];
        return enemyID==this.enemyID;
    }
}

export class GuideConditionNotFinishGuide {
    private readonly guideName:string = null;
    constructor(guideName:string) {
        this.guideName = guideName;
    }
    checkCondition():boolean {
        let bFinish:boolean = Player.player.hasFinishGuide(this.guideName)
        return !bFinish;
    }
}

export class GuideConditionFinishGuide {
    private readonly guideName:string = null;
    constructor(guideName:string) {
        this.guideName = guideName;
    }
    checkCondition():boolean {
        let bFinish:boolean = Player.player.hasFinishGuide(this.guideName);
        return bFinish;
    }
}

export class GuideConditionItem {
    private readonly itemName:string = null;
    constructor(itemName:string) {
        this.itemName = itemName;
    }
    checkCondition(...par):boolean {
        let itemName:string = par[0];
        return itemName==this.itemName;
    }
}