const {ccclass, property} = cc._decorator;
@ccclass
export default class DialogUI extends cc.Component {
    @property(cc.Sprite)
    dialogBG: cc.Sprite = null;
    @property(cc.Sprite)
    dialogHead: cc.Sprite = null;
    @property(cc.Label)
    nameLab: cc.Label = null;
    @property(cc.Label)
    textLab: cc.Label = null;
}