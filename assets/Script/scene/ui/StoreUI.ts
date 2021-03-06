import {Player} from "../../classes/Player";
import {GameUtil} from "../../common/GameUtil";
import {ConfigUtil} from "../../common/ConfigUtil";
import {CommonConfig} from "../../configs/CommonConfig";
import BulletSprite from "../../sprites/BulletSprite";
import StoreBulletUI from "./StoreBulletUI";
import {IMediator} from "../../framework/mvc/IMediator";
import {GameEvent} from "../../common/GameEvent";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {BUY_BULLET_STATE} from "../../common/GameEnum";
import {SoundConfig} from "../../configs/SoundConfig";
import {SceneManager} from "../../manager/scene/SceneManager";
import DialogUI from "./common/DialogUI";
import {DialogManager} from "../../manager/widget/DialogManager";
import BuyPlaneUI from "./BuyPlaneUI";

const {ccclass, property} = cc._decorator;
@ccclass
export default class StoreUI extends cc.Component implements IMediator {
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
    @property(cc.Sprite)
    planeSprite: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    planeSpriteAtlas: cc.SpriteAtlas = null;
    //战机描述
    @property(cc.Label)
    planeDescribeLab: cc.Label = null;
    //出击
    @property(cc.Button)
    startBtn: cc.Button = null;
    //购买子弹
    @property(cc.Button)
    buyBulletBtn: cc.Button = null;
    //自动合成
    @property(cc.Button)
    autoBuyBtn: cc.Button = null;
    @property(cc.Label)
    autoCombineTimeLab: cc.Label = null;
    //卖出最低等级
    @property(cc.Button)
    sellBulletBtn: cc.Button = null;

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
    //随机购买子弹等级
    @property(cc.Label)
    bulletLevelLab: cc.Label = null;
    //随机子弹价格
    @property(cc.Label)
    randomBulletPrice: cc.Label = null;
    //提示
    @property(cc.Node)
    flowHintNode: cc.Node = null;
    //合成动画
    @property(cc.Animation)
    combineAnim: cc.Animation = null;
    @property(cc.Animation)
    createBulletAnim: cc.Animation = null;
    @property(cc.Animation)
    levelUpEffectAnimation: cc.Animation = null;

    //战机购买界面
    @property(cc.Node)
    buyPlanePageview: cc.Node = null;

    private bulletPool: cc.NodePool = new cc.NodePool();
    private currentPlaneID: number = null;


    getCommands(){
        return [GameEvent.UPDATE_STORE_BULLET, GameEvent.FLY_NOTICE, GameEvent.UPDATE_STORE_GOLD, GameEvent.USE_PLANE,
            GameEvent.BUY_PLANE];
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
        this.changePlaneBtn.node.on(cc.Node.EventType.TOUCH_END, this.onChangePlaneBtn, this);
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.onStartBtn, this);
        this.buyBulletBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBulletBtn, this);
        this.autoBuyBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAutoBuyBtn, this);
        this.sellBulletBtn.node.on(cc.Node.EventType.TOUCH_END, this.onSellBulletBtn, this);
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.schedule(Player.player.saveData, 1);
        this.schedule(this.autoCombineBullet, 1);
        this.init();
    }

    protected onDisable(): void {
        ObserverManager.unRegisterObserverFun(this);
        this.changePlaneBtn.node.off(cc.Node.EventType.TOUCH_END, this.onChangePlaneBtn, this);
        this.startBtn.node.off(cc.Node.EventType.TOUCH_END, this.onStartBtn, this);
        this.buyBulletBtn.node.off(cc.Node.EventType.TOUCH_END, this.onBuyBulletBtn, this);
        this.sellBulletBtn.node.off(cc.Node.EventType.TOUCH_END, this.onSellBulletBtn, this);
        this.unschedule(this.shoot);
        this.unschedule(Player.player.saveData);
        this.unschedule(this.autoCombineBullet);
    }

    protected update(dt) {
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);
    }

    private init() {
        this.buyPlanePageview.active = false;
        this.autoCombineTimeLab.string = "自动合成" + CommonConfig.AUTO_COMBINE_MAX_TIME + "秒"
        this.currentPlaneID = Player.player.data.currentPlaneID;
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        this.planeSprite.spriteFrame = this.planeSpriteAtlas.getSpriteFrame(planeConfig.fightTextureName);
        this.planeDescribeLab.string = planeConfig.name;
        this.setBackground();
        this.goldCount.string = Player.player.data.gold + "";
        this.distanceLabel.string = Math.round(Player.player.data.maxDistance)+"";
        this.updateBuyBullet();
        this.updateBulletList();
        this.combineAnim.node.active = false;
        this.createBulletAnim.node.active = false;
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
        this.bulletLevelLab.string = "Lv." + storeSoldBulletGrade;
        this.randomBulletPrice.string = storeSoldBulletPrice + "";
    }

    private updateBulletList() {
        let storeBulletList: number[] = Player.player.data.storeBulletMap[this.currentPlaneID];
        let planeConfig = ConfigUtil.getPlaneConfig(this.currentPlaneID);
        let bulletType: number = planeConfig.bulletType;
        for (let i = 0; i < storeBulletList.length; i++) {
            this.storeBulletList[i].setBullet(this.currentPlaneID, bulletType, storeBulletList[i], i);
        }
    }

    private onChangePlaneBtn(): void {
        this.buyPlanePageview.active = !this.buyPlanePageview.active;
        let buyPlaneUI:BuyPlaneUI = this.buyPlanePageview.getComponent(BuyPlaneUI);
        buyPlaneUI.init();
    }

    private onStartBtn(): void {
        GameUtil.playSound(SoundConfig.OnclickEffect_mp3);
        SceneManager.instance().changeScene("fightScene");
    }

    private onBuyBulletBtn(): void {
        GameUtil.playSound(SoundConfig.OnclickEffect_mp3);
        let state: BUY_BULLET_STATE = Player.player.buyBullet(this.currentPlaneID);
        //如果没有格子了，抖动两个相同的子弹
        if (state == BUY_BULLET_STATE.NO_GRID) {
            let grid0: StoreBulletUI = null;
            let grid1: StoreBulletUI = null;
            let bHaveSame: boolean = false;
            //先根据从大到小排序
            let temp: StoreBulletUI = null;
            let tempList: StoreBulletUI[] = []
            for (let i = 0; i < this.storeBulletList.length; i++) {
                tempList.push(this.storeBulletList[i]);
            }
            for (let i = 0; i < tempList.length; i++) {
                for (let j = i + 1; j < tempList.length; j++) {
                    if (tempList[i].bulletLevel < tempList[j].bulletLevel) {
                        temp = tempList[i];
                        tempList[i] = tempList[j];
                        tempList[j] = temp; // 两个数交换位置 
                    }
                }
            }
            for (let i = 0; i < tempList.length; i++) {
                grid0 = tempList[i];
                if (grid0.bulletLevel <= 0) continue;
                for (let k = 0; k < this.storeBulletList.length; k++) {
                    grid1 = this.storeBulletList[k];
                    if (grid0 == grid1) continue;
                    if (grid0.bulletLevel == grid1.bulletLevel) {
                        bHaveSame = true;
                        break;
                    }
                }
                if (bHaveSame) {
                    break;
                }
            }
            //如果格子已满，并且已经没有相同等级的子弹，抖动最低等级的格子和卖出按钮
            if (grid0.bulletLevel != grid1.bulletLevel) {
                this.sellBulletBtn.node.runAction(GameUtil.shakeBy(0.5, 10, 5));
                let minGrid: StoreBulletUI = this.storeBulletList[0];
                for (let key in this.storeBulletList) {
                    if (this.storeBulletList[key].bulletLevel < minGrid.bulletLevel) {
                        minGrid = this.storeBulletList[key];
                    }
                }
                minGrid.node.runAction(GameUtil.shakeBy(0.5, 10, 5));
                return;
            }
            grid0.node.runAction(GameUtil.shakeBy(0.5, 10, 5));
            grid1.node.runAction(GameUtil.shakeBy(0.5, 10, 5));
            this.buyBulletBtn.interactable = false;
            this.buyBulletBtn.node.off(cc.Node.EventType.TOUCH_END, this.onBuyBulletBtn, this);
            this.scheduleOnce(function () {
                this.buyBulletBtn.interactable = true;
                this.buyBulletBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBulletBtn, this);
            }, 0.5);
            //如果在自动合成中
            if (Player.player.autoCombineBulletTime > 0) {
                grid0.autoCombineTarget(grid1);
            }
        }
    }

    private onAutoBuyBtn() {
        Player.player.autoCombineBulletTime = CommonConfig.AUTO_COMBINE_MAX_TIME;
        this.autoBuyBtn.interactable = false;
        this.autoBuyBtn.node.off(cc.Node.EventType.TOUCH_END, this.onAutoBuyBtn, this);
    }

    private onSellBulletBtn() {
        let storeBulletList: number[] = Player.player.data.storeBulletMap[this.currentPlaneID];
        let minGridIndex: number = null;
        let minLevel:number = 0;
        let validGridCount:number = 0;
        //找到最后一个有等级的子弹位
        for (let i = 0; i < storeBulletList.length; i++) {
            if(storeBulletList[i]==0) continue;
            minLevel = storeBulletList[i];
            minGridIndex = i;
            validGridCount++;
        }

        if(validGridCount==1) return;
        for (let i = 0; i < storeBulletList.length; i++) {
            if(storeBulletList[i]==0) continue;
            if(storeBulletList[i]<minLevel){
                minLevel = storeBulletList[i]
                minGridIndex = i;
            }
        }
        storeBulletList[minGridIndex] = 0;
        Player.player.addGold(ConfigUtil.getStoreSoldBulletPrice(minLevel));
        ObserverManager.sendNotification(GameEvent.UPDATE_STORE_GOLD);
        this.updateBulletList()
    }

    private autoCombineBullet() {
        if (Player.player.autoCombineBulletTime <= 0) return;
        Player.player.autoCombineBulletTime--;
        this.autoCombineTimeLab.string = "剩余时间：" + Player.player.autoCombineBulletTime + "秒"
        if (Player.player.autoCombineBulletTime == 0) {
            this.autoBuyBtn.interactable = true;
            this.autoBuyBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAutoBuyBtn, this);
            this.autoCombineTimeLab.string = "自动合成" + CommonConfig.AUTO_COMBINE_MAX_TIME + "秒"
        }
    }

    //发射子弹
    private shoot() {
        this.shootReal(this.planeSprite.node);
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
        this.planeSprite.node.addChild(spriteNode);
        let bulletSprite = spriteNode.getComponent(BulletSprite);
        bulletSprite.initSprite(spriteNode, this.bulletAtlas, this.bulletPool);
        let planeConfig = ConfigUtil.getPlaneConfig(this.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getBulletMaxGrade(this.currentPlaneID));
        return spriteNode;
    }
    //切换战机
    private changePlane(){
        this.currentPlaneID = Player.player.data.currentPlaneID;
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        this.planeSprite.spriteFrame = this.planeSpriteAtlas.getSpriteFrame(planeConfig.fightTextureName);
        this.planeDescribeLab.string = planeConfig.name;
        this.updateBuyBullet();
        this.updateBulletList();
    }

    private UPDATE_STORE_BULLET(levelUp: boolean, sourceIndex: number, targetIndex: number, bAuto: boolean) {
        if (levelUp) {
            GameUtil.playSound(SoundConfig.levelUpReady);
            this.levelUpEffectAnimation.node.active = true;
            this.levelUpEffectAnimation.play();
            this.levelUpEffectAnimation.on(cc.Animation.EventType.FINISHED, function () {
                this.levelUpEffectAnimation.node.active = false;
                this.levelUpEffectAnimation.off(cc.Animation.EventType.FINISHED)
            }, this)
        }
        GameUtil.playSound(SoundConfig.bulletCombine);
        this.updateBuyBullet();
        this.updateBulletList();
        let animation: cc.Animation = sourceIndex == -1 ? this.createBulletAnim : this.combineAnim;
        if (targetIndex != undefined) {
            let targetGrid: StoreBulletUI = this.storeBulletList[targetIndex];
            let worldPos = targetGrid.node.getPosition();
            animation.node.setPosition(worldPos);
            animation.node.setSiblingIndex(100);
            animation.node.active = true;
            animation.play();
            animation.on(cc.Animation.EventType.FINISHED, function () {
                animation.node.active = false;
                animation.off(cc.Animation.EventType.FINISHED);
            }, this);
        }
    }

    private FLY_NOTICE(notice: string) {
        this.flowHintNode.stopAllActions();
        let label: cc.Label = this.flowHintNode.getChildByName("label").getComponent(cc.Label);
        label.string = notice;
        this.flowHintNode.active = true;
        this.flowHintNode.opacity = 255;

        cc.tween(this.flowHintNode).delay(1).to(1, {opacity: 0}).call(function () {
            this.flowHintNode.active = false;
            // @ts-ignore
        }, this).start();
    }

    private UPDATE_STORE_GOLD() {
        this.goldCount.string = "" + Player.player.data.gold;
    }

    private USE_PLANE(planeID){
        Player.player.data.currentPlaneID = planeID;
        this.buyPlanePageview.active = false;
        this.changePlane();
    }

    private BUY_PLANE(planeID){
        if(Player.player.buyPlane(planeID)){
            this.buyPlanePageview.active = false;
            this.changePlane();
        }
    }
}