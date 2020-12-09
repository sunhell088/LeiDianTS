import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";
import FightScene from "../scene/FightScene";
import {FLY_STATE} from "../common/enum/FlyStateEnum";
import EnemySprite from "./enemy/EnemySprite";
import {Player} from "../classes/Player";
import ShipSprite from "./ShipSprite";

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
        this._spritePool.put(this._spriteNode);
    }

    update(dt){
        this.node.y -= CommonConfig.ROCK_SPEED*dt;
        if(this.node.y < -CommonConfig.HEIGHT) this.destroySprite();
    }

    //敌机与玩家的碰撞
    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        //敌机
        let shipSprite:ShipSprite = other.getComponent(ShipSprite);
        if(shipSprite){
            ShipSprite.getShipSprite().hurt();
        }
    }
}