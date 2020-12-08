import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";
import FightScene from "../scene/FightScene";
import ShipSprite from "./ShipSprite";

const {ccclass, property} = cc._decorator;
@ccclass
export default class RockLineSprite extends cc.Component {
    _spriteNode: cc.Node = null;
    _spritePool: cc.NodePool = null;

    //是否追踪玩家
    _bFollow: boolean = false;
    //警告标识（因为父节点放大了，所以不能）
    @property(cc.Sprite)
    warningSprite: cc.Sprite = null;


    initSprite(node:cc.Node, pool:cc.NodePool){
        this._spriteNode = node;
        this._spritePool = pool;
        //重新设置line宽，和警告标识为可见
        this.node.scaleX = 1;
        this.warningSprite.node.active = true;
    }

    update(dt) {
        if (!this._bFollow) return;
        let ship:ShipSprite = FightScene.getFightScene().getComponent(FightScene).ship;
        if (ship == null || !ship.node.active) return;
        if (ship.node.x > this.node.x + 1) {
            this.node.x += CommonConfig.ROCK_FOLLOW_SPEED * dt;
        } else if (ship.node.x < this.node.x - 1) {
            this.node.x -= CommonConfig.ROCK_FOLLOW_SPEED * dt;
        }
    }

    destroySprite () {
        this._spritePool.put(this._spriteNode);
    }
}