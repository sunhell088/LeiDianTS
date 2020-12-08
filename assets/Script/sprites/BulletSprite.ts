import {CommonConfig} from "../configs/CommonConfig";
import FightScene from "../scene/FightScene";

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
        let fightScene:FightScene = FightScene.getFightScene();
        this.node.y += CommonConfig.BULLET_SPEED * dt;
        if (this.node.y > fightScene.node.height/2) this.destroyBullet();
    }

    destroyBullet () {
        this.bulletPool.put(this.spriteNode);
    }

    onCollisionEnter(other, self) {
        this.destroyBullet();
    }
}