import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ItemSprite extends cc.Component {
    _spritePrefab: cc.Node = null;
    _spriteAtlas: cc.SpriteAtlas = null;
    _spritePool: cc.NodePool = null;

    //玩家吃到道具后执行的事件
    _itemConfig: any = null;
    //是否处于被吸引状态，如果是，则不判断碰撞了
    _bAttracting: boolean = false;

    destroySprite() {
        this.destroy();
        this._bAttracting = false;
    }

    drop() {
        CommonUtil.pClamp(this);
        let offset = this.node.x > CommonConfig.WIDTH_HALF ? -CommonConfig.WIDTH / 3 : CommonConfig.WIDTH / 3;
        offset = Math.random() * offset;
        var bezier = [new cc.Vec2(this.node.x + offset / 3, this.node.y + 100),
            new cc.Vec2(this.node.x + offset / 2, this.node.y + 60), new cc.Vec2(this.node.x + offset, -CommonConfig.HEIGHT * 2)];
        var action = cc.sequence(cc.bezierTo(2, bezier), cc.callFunc(this.destroySprite, this));
        this.node.runAction(action);
        if (this._itemConfig != ItemConfig.itemConfig.item_coin) {
            this.node.runAction(cc.rotateBy(1, Math.random() > 0.5 ? 360 : -360).repeatForever());
        }
    }
}