import FightScene from "./FightScene";
import {IMediator} from "../framework/mvc/IMediator";

const {ccclass, property} = cc._decorator;
@ccclass
export default class FightGuideScene extends FightScene implements IMediator {
    protected onLoad(): void {
        super.onLoad();
    }
}
