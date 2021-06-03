import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";
import {Player} from "../../classes/Player";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BuyPlaneUI extends cc.Component{
    @property(cc.Sprite)
    planeSpt :cc.Sprite =  null;
    @property([cc.SpriteFrame])
    planeSptFrameArr :cc.SpriteFrame[] =  [];
    @property(cc.Label)
    desLab :cc.Label =  null;
    @property(cc.Button)
    useBtn :cc.Button =  null;
    @property(cc.Button)
    buyBtn :cc.Button =  null;
    @property(cc.Label)
    priceLab :cc.Label =  null;

    private _planeConfig:any = null;

    init(planeConfig:any){
        this._planeConfig = planeConfig;
        this.planeSpt.spriteFrame = this.planeSptFrameArr[planeConfig.nameIndex];
        this.desLab.string = planeConfig.name;
        this.priceLab.string = planeConfig.price;
        this.useBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUseBtn, this);
        this.buyBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);
        //如果没有该战机
        if((Player.player.data.planeStorage&planeConfig.id)==0){
            this.useBtn.node.active = false;
            this.buyBtn.node.active = true;
        }else {
            this.useBtn.node.active = true;
            this.buyBtn.node.active = false;
        }
    }

    private onUseBtn(){
        ObserverManager.sendNotification(GameEvent.USE_PLANE, this._planeConfig.id);
    }
    private onBuyBtn(){
        ObserverManager.sendNotification(GameEvent.BUY_PLANE, this._planeConfig.id);
    }
}