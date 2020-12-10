import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";
import {Player} from "../classes/Player";
import ShipSprite from "./ShipSprite";
import CanvasNode from "../scene/CanvasNode";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ItemSprite extends cc.Component {
    _spriteNode: cc.Node = null;
    _spriteAtlas: cc.SpriteAtlas = null;
    _spritePool: cc.NodePool = null;

    //玩家吃到道具后执行的事件
    _itemConfig: any = null;
    //是否处于被吸引状态，如果是，则不判断碰撞了
    _bAttracting: boolean = false;

    initSprite(node:cc.Node, atlas:cc.SpriteAtlas, pool:cc.NodePool, itemConfig:any){
        this._spriteNode = node;
        this._spriteAtlas = atlas;
        this._spritePool = pool;
        this._itemConfig = itemConfig;
    }

    setSpriteFrame(){
        let frame = this._spriteAtlas.getSpriteFrame(this._itemConfig.textureName);
        this.getComponent(cc.Sprite).spriteFrame = frame;
    }

    destroySprite() {
        this._spritePool.put(this._spriteNode);
        this._bAttracting = false;
    }

    drop() {
        CommonUtil.pClamp(this.node);
        let offset = this.node.x > 0 ? -CommonConfig.WIDTH / 3 : CommonConfig.WIDTH / 3;
        offset = Math.random() * offset;
        var bezier = [new cc.Vec2(this.node.x + offset / 3, this.node.y + 100),
            new cc.Vec2(this.node.x + offset / 2, this.node.y + 60), new cc.Vec2(this.node.x + offset, -CommonConfig.HEIGHT)];
        var action = cc.sequence(cc.bezierTo(2, bezier), cc.callFunc(this.destroySprite, this));
        this.node.runAction(action);
        if (this._itemConfig != ItemConfig.itemConfig.item_coin) {
            this.node.runAction(cc.rotateBy(1, Math.random() > 0.5 ? 360 : -360).repeatForever());
        }
    }

    //玩家与金币等的碰撞
    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        if(other.getComponent(ShipSprite)){
            let itemSprite:ItemSprite = self.getComponent(ItemSprite);
            ObserverManager.sendNotification(GameEvent.ITEM_COLLISION_PLAYER, itemSprite)
            this.destroySprite();
        }
    }
}