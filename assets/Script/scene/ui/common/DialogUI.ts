import {DialogConfig} from "../../../configs/DialogConfig";
import {CommonConfig} from "../../../configs/CommonConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class DialogUI extends cc.Component {
    @property(cc.Sprite)
    clickMask: cc.Sprite = null;
    @property(cc.Sprite)
    dialogBG: cc.Sprite = null;
    @property(cc.Sprite)
    dialogHead: cc.Sprite = null;
    @property(cc.Label)
    nameLab: cc.Label = null;
    @property(cc.Label)
    textLab: cc.Label = null;

    private dialogConfig = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    public setDialog(dialogName:string) {
        this.node.active = true;
        this.dialogConfig = DialogConfig.dialogConfig[dialogName];
        this.nameLab.string = this.dialogConfig.speakerName;
        this.textLab.string = this.dialogConfig.textInfo;
    }

    private onClick(){
        this.dialogConfig.dialogAction();
    }
}