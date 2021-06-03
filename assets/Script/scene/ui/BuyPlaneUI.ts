import {IMediator} from "../../framework/mvc/IMediator";
import {PlaneConfig} from "../../configs/PlaneConfig";
import BuyPlaneNode from "./BuyPlaneNode";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BuyPlaneUI extends cc.Component {
    @property(cc.Layout)
    content: cc.Layout = null;
    @property(cc.Prefab)
    buyPlanePrefab: cc.Prefab = null;

    protected onLoad(): void {
        this.init();
    }

    public init(){
        this.content.node.removeAllChildren();
        for (let i = 0; i < PlaneConfig.planeConfig.length; i++) {
            let planeConfig = PlaneConfig.planeConfig[i];
            let buyPlaneNode = cc.instantiate(this.buyPlanePrefab);
            this.content.node.addChild(buyPlaneNode);
            let buyPlaneNodeSpt: BuyPlaneNode = buyPlaneNode.getComponent(BuyPlaneNode);
            buyPlaneNodeSpt.init(planeConfig);
        }
    }
}