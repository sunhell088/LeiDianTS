import {CommonConfig} from "../configs/CommonConfig";
import FightScene from "../scene/FightScene";
import EnemySprite from "./enemy/EnemySprite";
import CanvasNode from "../scene/CanvasNode";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";
import {Player} from "../classes/Player";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BulletSprite extends cc.Component {
    spriteNode:cc.Node = null;
    bulletAtlas:cc.SpriteAtlas = null;
    bulletPool:cc.NodePool = null;

    initSprite(spriteNode:cc.Node, bulletAtlas:cc.SpriteAtlas, bulletPool:cc.NodePool){
        this.spriteNode = spriteNode;
        this.bulletAtlas = bulletAtlas;
        this.bulletPool = bulletPool;
    }

    setBulletSpriteFrame(bulletType, level){
        let frame = this.bulletAtlas.getSpriteFrame(bulletType + '_' + level);
        this.getComponent(cc.Sprite).spriteFrame = frame;
    }

    update (dt) {
        this.node.y += CommonConfig.BULLET_SPEED * dt;
        if (this.node.y > CommonConfig.HEIGHT/2) this.destroyBullet();
    }

    destroyBullet () {
        this.bulletPool.put(this.spriteNode);
    }

    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        if(other.node.getComponent(EnemySprite)){
            this.destroyBullet();
            ObserverManager.sendNotification(GameEvent.BULLET_HIT_ENEMY, self.node.getPosition());
        }
    }
}