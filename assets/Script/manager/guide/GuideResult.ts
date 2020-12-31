import {DialogManager} from "../widget/DialogManager";
import {Player} from "../../classes/Player";

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
        cc.director.pause();
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