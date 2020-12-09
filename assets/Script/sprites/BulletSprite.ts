import {CommonConfig} from "../configs/CommonConfig";
import FightScene from "../scene/FightScene";
import EnemySprite from "./enemy/EnemySprite";
import {Player} from "../classes/Player";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BulletSprite extends cc.Component {

    @property(cc.Sprite)
    bulletHit:cc.Sprite = null;

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
        this.bulletHit.node.active = false;
    }

    update (dt) {
        let fightScene:FightScene = FightScene.getFightScene();
        this.node.y += CommonConfig.BULLET_SPEED * dt;
        if (this.node.y > fightScene.node.height/2) this.destroyBullet();
    }

    destroyBullet () {
        this.bulletPool.put(this.spriteNode);
    }

    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        if(other.node.getComponent(EnemySprite)){
            this.bulletHit.node.active = true;
            this.destroyBullet();
        }
    }
}