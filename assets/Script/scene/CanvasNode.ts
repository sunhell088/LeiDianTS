const {ccclass, property} = cc._decorator;
@ccclass
export default class CanvasNode extends cc.Component{
    public static getCanvasNode(): CanvasNode {
        return cc.find("Canvas").getComponent(CanvasNode);
    }
    //玩家飞船
    @property(cc.Node)
    private shipNode:cc.Node = null;
    //战斗场景平面
    @property(cc.Node)
    private fightNode:cc.Node = null;

    public getShipNodePos():cc.Vec2 {
        return this.shipNode.getPosition();
    }

    public getFightNodeSize():cc.Size {
        return this.fightNode.getContentSize();
    }
}