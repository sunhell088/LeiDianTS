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