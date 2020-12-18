import {Player} from "../../classes/Player";
import ShipSprite from "../../sprites/ShipSprite";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonUtil} from "../../common/CommonUtil";
import {ItemConfig} from "../../configs/ItemConfig";
import {IMediator} from "../../framework/mvc/IMediator";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";
import {ConfigUtil} from "../../common/ConfigUtil";
import CanvasNode from "../CanvasNode";
import {CommonConfig} from "../../configs/CommonConfig";
import BulletSprite from "../../sprites/BulletSprite";

const {ccclass, property} = cc._decorator;
@ccclass
export default class StoreUI extends cc.Component{
    @property(cc.Sprite)
    background0:cc.Sprite = null;
    @property(cc.Sprite)
    background1:cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgSptArr: cc.SpriteFrame[] = [];

    //最远距离
    @property(cc.Label)
    distanceLabel :cc.Label=  null;
    //金币数量
    @property(cc.Label)
    goldCount :cc.Label =  null;
    //升级战机
    @property(cc.Button)
    updatePlaneBtn :cc.Button =  null;
    //战机图片
    @property(cc.Node)
    planeNode:cc.Node = null;
    @property(cc.SpriteAtlas)
    planeSpriteAtlas:cc.SpriteAtlas = null;
    //战机描述
    @property(cc.Label)
    planeDescribeLab:cc.Label = null;
    //出击
    @property(cc.Button)
    startBtn :cc.Button =  null;
    //购买子弹
    @property(cc.Button)
    updateBulletBtn :cc.Button =  null;

    //子弹预设
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    bulletAtlas: cc.SpriteAtlas = null;

    //掉落物品预设
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    itemAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    shipShadowNode: cc.Node = null;

    private bulletPool: cc.NodePool = new cc.NodePool();

    protected onLoad(): void {
        this.updatePlaneBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUpdatePlaneBtn, this);
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.onStartBtn, this);
        this.updateBulletBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUpdateBulletBtn, this);
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.init();
    }

    protected onDisable():void {
        this.updatePlaneBtn.node.off(cc.Node.EventType.TOUCH_END, this.onUpdatePlaneBtn, this);
        this.startBtn.node.off(cc.Node.EventType.TOUCH_END, this.onStartBtn, this);
        this.updateBulletBtn.node.off(cc.Node.EventType.TOUCH_END, this.onUpdateBulletBtn, this);
        this.unschedule(this.shoot);
    }

    protected update (dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    private init(){
        this.setBackground();
    }
    private setBackground() {
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
    }

    private onUpdatePlaneBtn():void {

    }
    private onStartBtn():void {
        cc.director.loadScene('fightScene');
    }
    private onUpdateBulletBtn():void {

    }

    //发射子弹
    private shoot() {
        this.shootReal(this.planeNode);
        if(this.shipShadowNode.active){
            this.shootReal(this.shipShadowNode)
        }
    }

    //发射子弹
    private shootReal(ship: cc.Node) {
        let bullet = this.createBullet();
        bullet.x = ship.x;
        bullet.y = ship.y + ship.width+bullet.height;
    }

    //创建子弹复用对象
    private createBullet(): cc.Node {
        let spriteNode: cc.Node = null;
        if (this.bulletPool.size() > 0) {
            spriteNode = this.bulletPool.get();
            spriteNode.stopAllActions();
        } else {
            spriteNode = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(spriteNode);
        let bulletSprite = spriteNode.getComponent(BulletSprite);
        bulletSprite.initSprite(spriteNode, this.bulletAtlas, this.bulletPool);
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getBulletGrade(Player.player.data.currentPlaneID));
        return spriteNode;
    }
}