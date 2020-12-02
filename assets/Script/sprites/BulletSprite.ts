import {CommonConfig} from "../configs/CommonConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BulletSprite extends cc.Component {

    bulletPrefab:cc.Node = null;
    bulletAtlas:cc.SpriteAtlas = null;
    bulletPool:cc.NodePool = null;

    initBullet(bulletPrefab:cc.Node, bulletAtlas:cc.SpriteAtlas, bulletPool:cc.NodePool){
        this.bulletPrefab = bulletPrefab;
        this.bulletAtlas = bulletAtlas;
        this.bulletPool = bulletPool;
    }

    setBulletSpriteFrame(bulletType, level){
        let frame = this.bulletAtlas.getSpriteFrame(bulletType + '_' + level);
        this.getComponent(cc.Sprite).spriteFrame = frame;
    }

    update (dt) {
        this.node.y += CommonConfig.BULLET_SPEED * dt;
        if (this.node.y > CommonConfig.HEIGHT + this.node.height * 2) this.destroyBullet();
    }

    destroyBullet () {
        this.bulletPool.put(this.bulletPrefab);
    }
}