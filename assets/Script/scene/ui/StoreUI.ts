import {Player} from "../../classes/Player";
import {GameUtil} from "../../common/GameUtil";
import {ConfigUtil} from "../../common/ConfigUtil";
import {CommonConfig} from "../../configs/CommonConfig";
import BulletSprite from "../../sprites/BulletSprite";
import StoreBulletUI from "./StoreBulletUI";
import {IMediator} from "../../framework/mvc/IMediator";
import {GameEvent} from "../../common/GameEvent";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import log = cc.log;
import {BUY_BULLET_STATE} from "../../common/GameEnum";
import Game = cc.Game;

const {ccclass, property} = cc._decorator;
@ccclass
export default class StoreUI extends cc.Component implements IMediator {
    @property(cc.Button)
    checkDataBtn: cc.Button = null;
    @property(cc.Sprite)
    background0: cc.Sprite = null;
    @property(cc.Sprite)
    background1: cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgSptArr: cc.SpriteFrame[] = [];

    //最远距离
    @property(cc.Label)
    distanceLabel: cc.Label = null;
    //金币数量
    @property(cc.Label)
    goldCount: cc.Label = null;
    //升级战机
    @property(cc.Button)
    changePlaneBtn: cc.Button = null;
    //战机图片
    @property(cc.Node)
    planeNode: cc.Node = null;
    @property(cc.SpriteAtlas)
    planeSpriteAtlas: cc.SpriteAtlas = null;
    //战机描述
    @property(cc.Label)
    planeDescribeLab: cc.Label = null;
    //出击
    @property(cc.Button)
    startBtn: cc.Button = null;
    //出击
    @property(cc.Button)
    buyBtn: cc.Button = null;
    //购买子弹
    @property(cc.Button)
    buyBulletBtn: cc.Button = null;

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

    //影子战机的影子
    @property(cc.Node)
    shipShadowNode: cc.Node = null;

    //升级子弹的格子
    @property([StoreBulletUI])
    storeBulletList: StoreBulletUI[] = [];

    //随机购买子弹图片
    @property(cc.Sprite)
    randomBulletSprite: cc.Sprite = null;
    //随机子弹价格
    @property(cc.Label)
    randomBulletPrice: cc.Label = null;

    //提示
    @property(cc.Node)
    flowHintNode: cc.Node = null;


    private bulletPool: cc.NodePool = new cc.NodePool();
    private currentPlaneID: number = null;

    getCommands(): string[] {
        return [GameEvent.UPDATE_STORE_BULLET, GameEvent.FLY_NOTICE];
    }

    protected onLoad(): void {
        this.checkDataBtn.node.on(cc.Node.EventType.TOUCH_END, function () {
            window.alert(localStorage.playerData);
        }, this);
        ObserverManager.registerObserverFun(this);
        this.changePlaneBtn.node.on(cc.Node.EventType.TOUCH_END, this.onChangePlaneBtn, this);
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.onStartBtn, this);
        this.buyBulletBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBulletBtn, this);
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.init();
    }

    protected onDisable(): void {
        ObserverManager.unRegisterObserverFun(this);
        this.changePlaneBtn.node.off(cc.Node.EventType.TOUCH_END, this.onChangePlaneBtn, this);
        this.startBtn.node.off(cc.Node.EventType.TOUCH_END, this.onStartBtn, this);
        this.buyBulletBtn.node.off(cc.Node.EventType.TOUCH_END, this.onBuyBulletBtn, this);
        this.unschedule(this.shoot);
    }

    protected update(dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    private init() {
        this.schedule(Player.player.saveData, 1);
        this.currentPlaneID = Player.player.data.currentPlaneID
        this.setBackground();
        this.goldCount.string = Player.player.data.gold + "";
        this.updateBuyBullet();
        this.updateBulletList();

    }

    private setBackground() {
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
    }

    private updateBuyBullet() {
        let planeID: number = this.currentPlaneID;
        let storeSoldBulletGrade: number = Player.player.data.storeSoldBulletGradeMap[planeID];

        let storeSoldBulletPrice: number = ConfigUtil.getStoreSoldBulletPrice(storeSoldBulletGrade);
        let planeConfig = ConfigUtil.getPlaneConfig(planeID);
        let bulletType: number = planeConfig.bulletType;
        this.randomBulletSprite.spriteFrame = this.bulletAtlas.getSpriteFrame(bulletType + '_' + storeSoldBulletGrade);
        this.randomBulletPrice.string = storeSoldBulletPrice + "";
    }

    private updateBulletList() {
        for (let i = 0; i < this.storeBulletList.length; i++) {
            if (i < Player.player.data.storeBulletGridCount) {
                this.storeBulletList[i].node.active = true;
            } else {
                this.storeBulletList[i].node.active = false;
            }
        }
        let storeBulletList: number[] = Player.player.data.storeBulletMap[this.currentPlaneID];
        let planeConfig = ConfigUtil.getPlaneConfig(this.currentPlaneID);
        let bulletType: number = planeConfig.bulletType;
        for (let i = 0; i < storeBulletList.length; i++) {
            this.storeBulletList[i].setBullet(this.currentPlaneID, bulletType, storeBulletList[i], i);
        }
    }

    private onChangePlaneBtn(): void {
    }

    private onStartBtn(): void {
        cc.director.loadScene('fightScene');
    }

    private onBuyBulletBtn(): void {
        Player.player.buyBullet(this.currentPlaneID);
    }

    //发射子弹
    private shoot() {
        this.shootReal(this.planeNode);
        if (this.shipShadowNode.active) {
            this.shootReal(this.shipShadowNode)
        }
    }

    //发射子弹
    private shootReal(ship: cc.Node) {
        let bullet = this.createBullet();
        bullet.x = ship.x;
        bullet.y = ship.y + ship.height / 2;
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
        this.planeNode.addChild(spriteNode);
        let bulletSprite = spriteNode.getComponent(BulletSprite);
        bulletSprite.initSprite(spriteNode, this.bulletAtlas, this.bulletPool);
        let planeConfig = ConfigUtil.getPlaneConfig(this.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getBulletMaxGrade(this.currentPlaneID));
        return spriteNode;
    }

    private UPDATE_STORE_BULLET() {
        this.updateBuyBullet();
        this.updateBulletList();
    }

    private FLY_NOTICE(notice:string){
        this.flowHintNode.stopAllActions();
        let label:cc.Label = this.flowHintNode.getChildByName("label").getComponent(cc.Label);
        label.string = notice;
        this.flowHintNode.active = true;
        this.flowHintNode.opacity = 255;
        cc.tween(this.flowHintNode).delay(1).to(1, {opacity:0}).call(function () {
            this.active = false;
        }).start();
    }
}