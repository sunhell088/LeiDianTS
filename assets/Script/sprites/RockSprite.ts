import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";
import FightScene from "../scene/FightScene";
import {FLY_STATE} from "../common/enum/FlyStateEnum";

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
}