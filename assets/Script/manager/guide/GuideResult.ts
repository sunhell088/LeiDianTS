import {DialogManager} from "../widget/DialogManager";
import {Player} from "../../classes/Player";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";

export class GuideResultDialog {
    private readonly dialogName:string = null;
    constructor(...par) {
        this.dialogName = par[0];
    }
    doResult():void {
        DialogManager.instance().showDialog(this.dialogName);
    }
}
export class GuideResultPauseGame {
    doResult():void {
        setTimeout(function () {
            cc.director.pause();
        }, 100)
    }
}

export class GuideResultFinishGuide {
    private readonly guideID:string = null;
    constructor(...par) {
        this.guideID = par[0];
    }
    doResult():void {
        Player.player.guideFinish(this.guideID);
    }
}

export class GuideResultOpenDoubleClickUI {
    doResult():void {
        ObserverManager.sendNotification(GameEvent.OPEN_DOUBLE_CLICK_HINT);
    }
}