import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";

export class GuideResultDialog {
    private readonly dialogID:number = null;
    constructor(dialogID:number) {
        this.dialogID = dialogID;
    }
    doResult():void {
        ObserverManager.sendNotification(GameEvent.GUIDE_RESULT_DIALOG, this.dialogID);
    }
}