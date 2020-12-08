import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";
import FightScene from "../scene/FightScene";
import ShipSprite from "./ShipSprite";

const {ccclass, property} = cc._decorator;
@ccclass
export default class RockLineSprite extends cc.Component {
    _spritePrefab: cc.Node = null;
    _spritePool: cc.NodePool = null;

    //是否追踪玩家
    _bFollow: boolean = false;
    //警告标识（因为父节点放大了，所以不能）
    @property(cc.Sprite)
    warningSprite: cc.Sprite = null;


    initSprite(prefab:cc.Node, pool:cc.NodePool){
        this._spritePrefab = prefab;
        this._spritePool = pool;
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
        // this.warningSprite.node.x = this.node.x
    }

    destroyBullet () {
        this._spritePool.put(this._spritePrefab);
    }
}