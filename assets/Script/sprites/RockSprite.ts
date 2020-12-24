import {CommonConfig} from "../configs/CommonConfig";
import ShipSprite from "./ShipSprite";
import CanvasNode from "../scene/CanvasNode";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";

const {ccclass, property} = cc._decorator;
@ccclass
export default class RockSprite extends cc.Component {
    _spriteNode: cc.Node = null;
    _spriteAtlas: cc.SpriteAtlas = null;
    _spritePool: cc.NodePool = null;


    initSprite(node:cc.Node, pool:cc.NodePool){
        this._spriteNode = node;
        this._spritePool = pool;
    }

    destroySprite () {
        console.log("destroySprite Rock")
        this._spritePool.put(this._spriteNode);
    }

    update(dt){
        this.node.y -= CommonConfig.ROCK_SPEED*dt;
        if(this.node.y < -CommonConfig.HEIGHT/2) this.destroySprite();
    }

    //敌机与玩家的碰撞
    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        if(other.getComponent(ShipSprite)){
            ObserverManager.sendNotification(GameEvent.ROCK_COLLISION_PLAYER)
            this.destroySprite();
        }
    }
}