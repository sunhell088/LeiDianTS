import {DialogManager} from "../widget/DialogManager";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";

export class GuideResultDialog {
    private readonly dialogName:string = null;
    constructor(dialogName:string) {
        this.dialogName = dialogName;
    }
    doResult(...par):void {
        DialogManager.instance().showDialog(this.dialogName);
    }
}
export class GuidePauseGame {
    doResult(...par):void {
        cc.director.pause();
    }
}
export class GuideFocusEnemy {
    doResult(...par):void {
        let enemyID:string = par[0]
        ObserverManager.sendNotification(GameEvent.GUIDE_FOCUS_ENEMY, enemyID);
    }
}