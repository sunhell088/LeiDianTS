export class GuideConditionFinishID {
    private readonly guideID:number = null;
    constructor(guideID:number) {
        this.guideID = guideID;
    }

    checkCondition(guideID:number):boolean {
        return guideID==this.guideID
    }
}