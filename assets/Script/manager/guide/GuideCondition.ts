import {Player} from "../../classes/Player";

export class GuideConditionFinishID {
    private readonly guideName:string = null;
    constructor(guideName:string) {
        this.guideName = guideName;
    }

    checkCondition():boolean {
        return Player.player.checkGuideFinish(this.guideName)
    }
}