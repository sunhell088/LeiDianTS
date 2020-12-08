import {CommonUtil} from "../common/CommonUtil";
import {Player} from "../classes/Player";
import {PlaneConfig} from "../configs/PlaneConfig";
import {EnemyConfig} from "../configs/EnemyConfig";
import {SoundConfig} from "../configs/SoundConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {FormationConfig} from "../configs/FormationConfig";
import EnemySprite from "../sprites/enemy/EnemySprite";
import {DifficultConfig} from "../configs/DifficultConfig";
import {IMediator} from "../framework/mvc/IMediator";
import {GameUtil} from "../common/GameUtil";
import ShipSprite from "../sprites/ShipSprite";
import {GameEvent} from "../common/GameEvent";
import {ObserverManager} from "../framework/observe/ObserverManager";
import RockLineSprite from "../sprites/RockLineSprite";
import RockSprite from "../sprites/RockSprite";
import {Observer} from "../framework/observe/Observer";
import BossEnemySprite from "../sprites/enemy/BossEnemySprite";
import FollowEnemySprite from "../sprites/enemy/FollowEnemySprite";
import {CLEAN_TYPE} from "../common/enum/FlyStateEnum";
import {StoreItemConfig} from "../configs/StoreItemConfig";
import FightUI from "./ui/FightUI";
import ItemSprite from "../sprites/ItemSprite";


const {ccclass, property} = cc._decorator;
@ccclass
export default class FightScene extends cc.Component implements IMediator {

    @property(cc.Sprite)
    background0: cc.Sprite = null;
    @property(cc.Sprite)
    background1: cc.Sprite = null;
    @property([cc.SpriteFrame])
    bgSptArr: cc.SpriteFrame[] = [];

    @property(ShipSprite)
    ship: ShipSprite = null;
    @property(cc.SpriteAtlas)
    shipAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    bulletAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    enemyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    enemyStayPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    enemyBossPrefab: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    enemyAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    rockLinePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    rockPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    itemAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    deadEffectPlayerPrefab:cc.Prefab = null;
    @property(cc.Prefab)
    deadEffectEnemyPrefab:cc.Prefab = null;

    bulletPool: cc.NodePool = new cc.NodePool();
    enemyPool: cc.NodePool = new cc.NodePool();
    enemyFlexPool: cc.NodePool = new cc.NodePool();
    enemyBossPool: cc.NodePool = new cc.NodePool();
    enemyFollowPool: cc.NodePool = new cc.NodePool();
    enemyStayPool: cc.NodePool = new cc.NodePool();
    rockLinePool: cc.NodePool = new cc.NodePool();
    rockPool: cc.NodePool = new cc.NodePool();
    itemPool: cc.NodePool = new cc.NodePool();
    deadEffectPool: cc.NodePool = new cc.NodePool();

    public static getFightScene(): FightScene {
        return cc.find("Canvas").getComponent(FightScene);
    }

    getCommands(): string[] {
        //开启碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        return [GameEvent.SPURT_ACTION, GameEvent.DOUBLE_FIRE_ACTION, GameEvent.XTS_ACTION, GameEvent.EAT_ITEM,
            GameEvent.STORE_REVIVE, GameEvent.STORE_SPURT, GameEvent.STORE_DEATH, GameEvent.STORE_CHANGE_PLANE];
    }

    onSpurtAction() {
        // if(g_sharedGameLayer._spurt||g_sharedGameLayer._spurtReadying) return;
        // //吃道具效果
        // VVV.eatItemEffect(ItemConfig.item_cc);
        // //冲刺持续时间（分为普通冲刺、开局道具冲刺、死亡冲刺）
        // var spurtDuration = g_sharedGameLayer._startSpurtDuration>0?g_sharedGameLayer._startSpurtDuration:VVV.SPURT_DURATION;
        // spurtDuration = g_sharedGameLayer._deathSpurtDuration>0?g_sharedGameLayer._deathSpurtDuration:spurtDuration;
        // //冲刺准备
        // var spurtReadyAction = cc.callFunc(
        //     function(){
        //         //音效
        //         VVV.playEffect(res.cc_ready);
        //         g_sharedGameLayer._spurtReadying = true;
        //         //清屏
        //         g_sharedGameLayer.cleanEnemy();
        //         //蓄能动画
        //         var spurtReadySprite = g_sharedGameLayer._ship.spurtReadySprite;
        //         spurtReadySprite.setVisible(true);
        //         var animate = VVV.getAnimateAction(EffectConfig.cc_start_efx);
        //         spurtReadySprite.runAction(cc.sequence(
        //             animate,
        //             VVV.getHideSelfCallFun(spurtReadySprite)
        //         ));
        //     },null
        // );
        // //冲刺开始
        // var spurtStartAction = cc.callFunc(
        //     function(){
        //         //开始冲刺
        //         g_sharedGameLayer._spurtReadying = false;
        //         g_sharedGameLayer.setSpurt(true);
        //         g_sharedGameLayer.unschedule(g_sharedGameLayer.scheduleNormalEnemey);
        //         g_sharedGameLayer.schedule(g_sharedGameLayer.scheduleNormalEnemey, VVV.ENEMY_SPURT_DELAY);
        //     },null
        // );
        // //冲刺结束
        // var spurtOverAction = cc.callFunc(
        //     function(){
        //         //爆炸效果
        //         g_sharedGameLayer._ship.levelUpRing.setVisible(true);
        //         g_sharedGameLayer._ship.levelUpLight.setVisible(false);
        //         g_sharedGameLayer._ship.levelUpRing.setScale(0.5);
        //         g_sharedGameLayer._ship.levelUpRing.runAction(cc.sequence(cc.scaleBy(1,50),
        //             cc.callFunc(function(){
        //                 g_sharedGameLayer._ship.levelUpRing.setVisible(false);
        //                 g_sharedGameLayer._ship.levelUpRing.setScale(1);
        //             },null)
        //         ));
        //         //冲刺完时当前屏幕的飞机暴落物品
        //         var enemyArray = [];
        //         for(var e=0; e<VVV.CONTAINER.ENEMYS_CHECK_COLLIDE.length; e++){
        //             var enemy = VVV.CONTAINER.ENEMYS_CHECK_COLLIDE[e];
        //             if(!enemy.visible) continue;
        //             enemyArray.push(enemy);
        //         }
        //         //暴落当前飞机数目的两倍
        //         var dropItemArray = VVV.getDropItemArray(enemyArray.length);
        //         for(var i=0;i<dropItemArray.length;i++){
        //             var item = ItemSprite.getItem(dropItemArray[i]);
        //             if(!item) continue;
        //             item.setPosition(enemyArray[i].getPosition());
        //             if(i<enemyArray.length){
        //                 item.x += hlx.random(-100,100);
        //                 item.y += hlx.random(0,100);
        //             }
        //             item.drop();
        //         }
        //
        //         g_sharedGameLayer.setSpurt(false);
        //         g_sharedGameLayer.cleanEnemy();
        //         g_sharedGameLayer.unschedule(g_sharedGameLayer.scheduleNormalEnemey);
        //         g_sharedGameLayer.schedule(g_sharedGameLayer.scheduleNormalEnemey, VVV.ENEMY_DELAY);
        //         //开局冲刺标识重置
        //         g_sharedGameLayer._startSpurtDuration = 0;
        //         //死亡冲刺后死掉
        //         if(g_sharedGameLayer._deathSpurtDuration>0){
        //             g_sharedGameLayer._ship.death();
        //             g_sharedGameLayer._ship.runAction(cc.sequence(
        //                 cc.delayTime(1),
        //                 cc.callFunc(g_sharedGameLayer.onGameOver)
        //             ));
        //         }
        //     },
        //     null
        // );
        //
        // g_sharedGameLayer.runAction(cc.sequence(
        //     spurtReadyAction,
        //     cc.delayTime(0.5),
        //     spurtStartAction,
        //     cc.delayTime(spurtDuration),
        //     spurtOverAction
        // ));
    }

    onDoubleFireAction() {
        // //升级状态 无效
        // if(g_sharedGameLayer._ship._invincible||g_sharedGameLayer._ship._levelUpIng) return;
        // if(g_sharedGameLayer._ship.planeID!=PlaneConfig.plane2.id){
        //     //这里移除action是为了每次获得效果后，重置效果时间
        //     g_sharedGameLayer.stopActionByTag("DoubleFire");
        //     g_sharedGameLayer._ship._doubleFire = true;
        //     var action = g_sharedGameLayer.runAction(cc.sequence(
        //         cc.delayTime(15),
        //         cc.callFunc(
        //             function(){ g_sharedGameLayer._ship._doubleFire = false; }
        //         )
        //     ));
        //     action.setTag("DoubleFire");
        //     //效果
        //     VVV.eatItemEffect(ItemConfig.item_doubleFire);
        // }else{
        //     //ItemConfig.item_double.itemFunction();
        // }
    }

    onXTSAction() {
        // //if(true) return;
        // if(g_sharedGameLayer._ship.planeID==PlaneConfig.plane1.id){
        //     return;
        // }
        // //这里移除action是为了每次获得效果后，重置效果时间
        // g_sharedGameLayer.stopActionByTag("magnet");
        // g_sharedGameLayer._ship.setMagnet(true);
        // var action = g_sharedGameLayer.runAction(cc.sequence(
        //     cc.delayTime(15),
        //     cc.callFunc(
        //         function(){ g_sharedGameLayer._ship.setMagnet(false); },
        //         null
        //     )
        // ));
        // action.setTag("magnet");
        // //特效
        // VVV.eatItemEffect(ItemConfig.item_xts);
    }

    onEatItem(itemConfig) {
        // var eatEffect = GameUtil.getEatEffectPreset();
        // if(eatEffect!=null){
        //     eatEffect.setPosition(g_sharedGameLayer._ship.x, g_sharedGameLayer._ship.y - 10);
        //     eatEffect.runAction(cc.sequence(
        //         cc.scaleTo(0.2, 0, 1),
        //         cc.callFunc(function(sender){
        //             sender.setScale(1);
        //             sender.setVisible(false);
        //         })
        //     ));
        // }
        // if(itemConfig.gold){
        //     //音效
        //     if(itemConfig == ItemConfig.item_coin){
        //         GameUtil.playEffect(SoundConfig.get_coin);
        //     }else{
        //         GameUtil.playEffect(SoundConfig.get_bs);
        //     }
        // }else{
        //     var effectSprite = VVV.CONTAINER.ITEM_NAME_TEXTURE[itemConfig.name]
        //     effectSprite.setVisible(true);
        //     effectSprite.setScale(2, 0);
        //     effectSprite.setPosition(g_sharedGameLayer._ship.x, g_sharedGameLayer._ship.y + effectSprite.height*1.5);
        //     //超过屏幕边界修正过来
        //     CommonUtil.pClamp(effectSprite);
        //     effectSprite.runAction(cc.sequence(
        //         cc.scaleTo(0.1, 1.2),
        //         cc.scaleTo(0.2, 1),
        //         cc.delayTime(0.4),
        //         cc.scaleTo(0.2, 2, 0),
        //         cc.callFunc(function(sender){ sender.setVisible(false);})
        //     ));
        //     //音效
        //     GameUtil.playEffect(SoundConfig.get_item);
        // }
    }

    onStoreRevive() {
        // //从未拥有飞机中随机一架，如果都拥有了，则随机非当前飞机
        // var randomArr = []
        // for(var p in PlaneConfig){
        //     if(PlaneConfig[p].id==g_player.data.currentPlaneID) continue;
        //     randomArr.push(PlaneConfig[p].id);
        // }
        // //乱序
        // randomArr.sort(function(){return Math.random()>0.5?-1:1;});
        // for(var k in randomArr){
        //     if(!g_player.getPlane(randomArr[k])){
        //         g_sharedGameLayer._revivePlaneID = randomArr[k];
        //         break;
        //     }
        // }
        // if(g_sharedGameLayer._revivePlaneID<=0){
        //     g_sharedGameLayer._revivePlaneID = randomArr[0];
        // }
    }

    onStoreSpurt() {
        // //出现道具图标
        // var storeItemIcon = g_FightUILayer._storeItemSpurt;
        // storeItemIcon.setPosition(VVV.WIDTH_HALF, VVV.HEIGHT_HALF);
        // storeItemIcon.setScale(8);
        // storeItemIcon.runAction(cc.sequence(
        //     cc.delayTime(g_sharedGameLayer._ship._changePlaneIng?3:0),
        //     cc.delayTime(1.5),
        //     cc.callFunc(function(){
        //         storeItemIcon.setVisible(true);
        //     }),
        //     cc.scaleTo(0.2,1),
        //     hlx.shakeBy(0.3,10,5),
        //     cc.callFunc(function(){
        //         g_sharedGameLayer._startSpurtDuration = 3000/VVV.DISTANCE_SPURT_SPEED;
        //         ////至少冲刺默认时间
        //         //if(g_sharedGameLayer._startSpurtDuration < VVV.SPURT_DURATION*2){
        //         //    g_sharedGameLayer._startSpurtDuration = VVV.SPURT_DURATION*2;
        //         //}
        //         ItemConfig.item_cc.itemFunction();
        //     }),
        //     cc.delayTime(1.5),
        //     VVV.getHideSelfCallFun(storeItemIcon)
        // ));
    }

    onStoreDeath() {
        // g_sharedGameLayer._ship.death();
        // //出现道具图标
        // var storeItemIcon = g_FightUILayer._storeItemDeath;
        // storeItemIcon.setPosition(VVV.WIDTH_HALF, VVV.HEIGHT_HALF);
        // storeItemIcon.setScale(8);
        // storeItemIcon.runAction(cc.sequence(
        //     cc.delayTime(1.5),
        //     cc.callFunc(function(){
        //         storeItemIcon.setVisible(true);
        //     }),
        //     cc.scaleTo(0.2,1),
        //     hlx.shakeBy(0.3,10,5),
        //     cc.callFunc(function(){
        //         g_sharedGameLayer._ship.revive();
        //         g_sharedGameLayer._ship.setPosition(VVV.WIDTH_HALF,g_sharedGameLayer._ship.height*2);
        //
        //         g_sharedGameLayer._deathSpurtDuration = 1000/VVV.DISTANCE_SPURT_SPEED;
        //         ////至少冲刺默认时间
        //         //if(g_sharedGameLayer._deathSpurtDuration < VVV.SPURT_DURATION*3){
        //         //    g_sharedGameLayer._deathSpurtDuration = VVV.SPURT_DURATION*3;
        //         //}
        //         ItemConfig.item_cc.itemFunction();
        //     }),
        //     cc.delayTime(1.5),
        //     VVV.getHideSelfCallFun(storeItemIcon)
        // ));

    }

    onStoreChangePlane() {
        // g_sharedGameLayer._ship._changePlaneIng = true;
        // //出现道具图标
        // var storeItemIcon = g_FightUILayer._storeItemChange;
        // storeItemIcon.setPosition(VVV.WIDTH_HALF, VVV.HEIGHT_HALF);
        // storeItemIcon.setScale(8);
        // storeItemIcon.runAction(cc.sequence(
        //     cc.delayTime(1),
        //     cc.callFunc(function(){
        //         storeItemIcon.setVisible(true);
        //     }),
        //     cc.scaleTo(0.2,1),
        //     hlx.shakeBy(0.3,10,5),
        //     //老飞机退场
        //     cc.callFunc(function(){
        //         g_sharedGameLayer._ship.runAction(cc.moveTo(0.5, g_sharedGameLayer._ship.x, -g_sharedGameLayer._ship.height));
        //     }),
        //     cc.delayTime(0.5),
        //     cc.callFunc(function(){
        //         var planeArray = [];
        //         for(var p in PlaneConfig){
        //             if(!g_player.getPlane(PlaneConfig[p].id)){
        //                 planeArray.push(PlaneConfig[p]);
        //             }
        //         }
        //         if(planeArray.length==0) return;
        //         var randomIndex = hlx.random(0,planeArray.length-1);
        //         g_sharedGameLayer._ship.changePlane(planeArray[randomIndex]);
        //     }),
        //     cc.delayTime(1),
        //     VVV.getHideSelfCallFun(storeItemIcon),
        //     cc.callFunc(function(){
        //         g_sharedGameLayer._ship._changePlaneIng = false;
        //     })
        // ));
    }

    onLoad(): void {
        //切换背景音乐
        GameUtil.playMusic(SoundConfig.fightMusic_mp3);
        ObserverManager.registerObserverFun(this);

        this.setBackground();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);

        this.initPlayer();
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.schedule(this.scheduleNormalEnemy, CommonConfig.ENEMY_DELAY);
        // this.schedule(this.scheduleRockGroup, CommonConfig.ROCK_CONFIG_DELAY);
        // this.schedule(this.scheduleBlessEnemy, CommonConfig.BLESS_PLANE_DELAY);
        // this.schedule(this.scheduleStayEnemy, CommonConfig.STAY_ENEMY_DELAY);
    }

    update(dt) {
        this.moveBackground(dt);
    }

    setBackground() {
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
    }

    //根据player信息初始化显示对象
    initPlayer() {
        let planeConfig = PlaneConfig.getPlaneConfig(Player.player.data.currentPlaneID);
        this.ship.shipSprite.spriteFrame = this.shipAtlas.getSpriteFrame(planeConfig.fightTextureName);
        this.ship.node.setPosition(0, 0);
        planeConfig.planeFunction(this.ship);

        //重置和战斗相关的数据
        Player.player.resetFightData();

        this.storeItemEffect("start");


        //初始化战斗UI
        FightUI.getFightUI().initUI();
        //登场
        this.ship.comeOnStage();
    }

    //商城道具效果(开局时)
    storeItemEffect(state):boolean {
        let triggerSuccess = false;
        //随机道具
        let item = StoreItemConfig.getStoreItemConfig(Player.player.randomItemID);
        if(item&&item.trigger==state){
            item.itemFunction();
            Player.player.randomItemID = "0";
            triggerSuccess = true;
        }
        //购买的道具
        for(var i=0; i<Player.player.data.storeItemPackage.length; i++){
            var itemObj = Player.player.data.storeItemPackage[i];
            item = StoreItemConfig.getStoreItemConfig(itemObj.itemID);
            if(item.trigger==state){
                if(Player.player.useStoreItem(itemObj.itemID)){
                    triggerSuccess = true;
                }
            }
        }
        return triggerSuccess;
    }

    onTouchBegan(event) {
    }

    onTouchMoved(event) {
        if(!this.ship.node.active) return;
        let target = this.ship.node;
        let touch = event.currentTouch;
        let delta = touch.getDelta();
        let curPos = new cc.Vec2(target.x, target.y);
        curPos = curPos.addSelf(delta)
        let shipHalfWidth = target.width / 2;
        let shipHalfHeight = target.height / 2;
        curPos = curPos.clampf(new cc.Vec2(-this.node.width / 2 + shipHalfWidth, -this.node.height / 2 + shipHalfHeight),
            new cc.Vec2(this.node.width / 2 - shipHalfWidth, this.node.height / 2 - shipHalfHeight));
        target.x = curPos.x;
        target.y = curPos.y;
    }

    //根据飞行距离加速敌机速度
    public addEnemySpeed(distanceStage) {
        switch (distanceStage) {
            case 7:
                Player.player._enemyAddSpeed = 50;
                break;
            case 10:
                Player.player._enemyAddSpeed = 100;
                break;
            case 15:
                Player.player._enemyAddSpeed = 125;
                break;
            case 20:
                Player.player._enemyAddSpeed = 150;
                break;
            case 25:
                Player.player._enemyAddSpeed = 175;
                break;
            case 30:
                Player.player._enemyAddSpeed = 200;
                break;
        }
    }

    shoot() {
        if(Player.player._stopBullet) return;
        if(Player.player._changePlaneIng) return;
        if(Player.player._death) return;
        if(Player.player._spurt) return;
        if(Player.player._levelUpIng) return;
        let bullet = this.createBullet();
        bullet.x = this.ship.node.x;
        bullet.y = this.ship.node.y + this.ship.node.width / 2;
        bullet.setScale(1);
        //升级时子弹不双倍和变大
        if(!Player.player._levelUpIng&&!Player.player._invincible){
            //二条
            var bullet2 = null;
            if(Player.player._doubleFire){
                var scaleRatio = Player.player._doublePower?1.6:1.1;

                bullet2 = this.createBullet();
                if(!bullet2) return;
                bullet2.x = this.ship.node.x + bullet2.width*scaleRatio/2;
                bullet2.y = bullet.y;
                bullet2.setScale(1);

                bullet.x = this.node.x - bullet.width*scaleRatio/2;
            }
            //加粗
            if(Player.player._doublePower){
                bullet.setScale(1.5);
                if(bullet2) bullet2.setScale(1.5);
            }
        }
    }

    createBullet(): cc.Node {
        let spriteNode:cc.Node = null;
        if (this.bulletPool.size() > 0) {
            spriteNode = this.bulletPool.get();
        } else {
            spriteNode = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(spriteNode);
        let bulletSprite = spriteNode.getComponent('BulletSprite');
        bulletSprite.initSprite(spriteNode, this.bulletAtlas, this.bulletPool);
        let planeConfig = PlaneConfig.getPlaneConfig(Player.player.data.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getGrade(Player.player.data.currentPlaneID));
        return spriteNode;
    }

    createEnemy(enemyConfig: any): EnemySprite {
        let spriteNode: cc.Node = null;
        let enemySprite: EnemySprite = null;
        let pool: cc.NodePool = this.enemyPool;
        let enemyPrefab:cc.Prefab = this.enemyPrefab;
        let classNameStr:string = Observer.getQualifiedClassName(enemyConfig.classType);
        switch (classNameStr) {
            case "FlexEnemySprite":
                pool = this.enemyFlexPool;
                break;
            case "StayEnemySprite":
                pool = this.enemyStayPool;
                enemyPrefab = this.enemyStayPrefab;
                break;
            case "BossEnemySprite":
                pool = this.enemyBossPool;
                enemyPrefab = this.enemyBossPrefab;
                break;
            case "FollowEnemySprite":
                pool = this.enemyFollowPool;
                break;
        }

        if (pool.size() > 0) {
            spriteNode = pool.get();
            enemySprite = spriteNode.getComponent(enemyConfig.classType);
        } else {
            spriteNode = cc.instantiate(enemyPrefab);
            enemySprite = spriteNode.addComponent(enemyConfig.classType);
        }
        this.node.addChild(spriteNode);
        enemySprite.bloodBar = spriteNode.children[0].getComponent(cc.ProgressBar);
        enemySprite.initSprite(spriteNode, this.enemyAtlas, pool, enemyConfig);
        enemySprite.setSpriteFrame();
        return enemySprite;
    }

    createRockLineSprite(): RockLineSprite {
        let spriteNode:cc.Node = null;
        if (this.rockLinePool.size() > 0) {
            spriteNode = this.rockLinePool.get();
        } else {
            spriteNode = cc.instantiate(this.rockLinePrefab);
        }
        this.node.addChild(spriteNode);
        let rockLineSprite: RockLineSprite = spriteNode.getComponent('RockLineSprite');
        rockLineSprite.initSprite(spriteNode, this.rockLinePool);
        return rockLineSprite;
    }

    createRockSprite(): RockSprite {
        let spriteNode:cc.Node = null;
        if (this.rockPool.size() > 0) {
            spriteNode = this.rockPool.get();
        } else {
            spriteNode = cc.instantiate(this.rockPrefab);
        }
        this.node.addChild(spriteNode);
        let rockSprite: RockSprite = spriteNode.getComponent('RockSprite');
        rockSprite.initSprite(spriteNode, this.rockPool);
        return rockSprite;
    }

    createItemSprite(itemConfig:any): ItemSprite {
        let spriteNode = null;
        if (this.itemPool.size() > 0) {
            spriteNode = this.itemPool.get();
        } else {
            spriteNode = cc.instantiate(this.itemPrefab);
        }
        this.node.addChild(spriteNode);
        let itemSprite: ItemSprite = spriteNode.getComponent('ItemSprite');
        itemSprite.initSprite(spriteNode,this.itemAtlas, this.rockPool, itemConfig);
        return itemSprite;
    }

    createDeadEffectEnemySprite(): cc.Node {
        let spriteNode:cc.Node = null;
        if (this.itemPool.size() > 0) {
            spriteNode = this.deadEffectPool.get();
        } else {
            spriteNode = cc.instantiate(this.deadEffectEnemyPrefab);
        }
        this.node.addChild(spriteNode);
        return spriteNode;
    }

    moveBackground(dt) {
        if (Player.player._changePlaneIng) return;
        if (Player.player._death) return;
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);

        //记录飞行距离
        var showSpeed = Player.player._spurt ? CommonConfig.DISTANCE_SPURT_SPEED : CommonConfig.DISTANCE_SPEED;
        Player.player.currentDistance += showSpeed * dt;
        var tempForRound = Math.round(Player.player.currentDistance);
        ObserverManager.sendNotification(GameEvent.MOVE_BG, tempForRound);
        //每500M报数
        if (Player.player.getDistanceStage() > Player.player._preDistanceStage) {
            Player.player._preDistanceStage = Player.player.getDistanceStage();
            //普通飞机速度变快
            this.addEnemySpeed(Player.player._preDistanceStage);
            //创建BOSS
            this.createBoos(Player.player._preDistanceStage);
            //创建新飞机预设
            // EnemySprite.presetDynamic(this._preDistanceStage);
        }
    }

    //定时创建普通飞机
    scheduleNormalEnemy() {
        //升级状态中 不创建
        if (Player.player._levelUpIng) return;
        var formation = FormationConfig.formationConfig[CommonUtil.random(0, FormationConfig.formationConfig.length - 1)];
        var dropItemArray = DifficultConfig.getDropItemArray(formation.length);
        //五架飞机中必有一个最低级飞机
        var worstEnemyIndex = CommonUtil.random(0, formation.length - 1);
        //一定几率出现两个最低级飞机(如果重复，这这次只有一架)
        var worstEnemyIndex2 = CommonUtil.random(0, formation.length - 1);
        //一定几率创建自爆飞机
        var bombEnemyIndex = -1;
        if (Player.player._createBombEnemy) {
            bombEnemyIndex = CommonUtil.random(0, formation.length - 1);
        }
        for (var i = 0; i < formation.length; i++) {
            var enemyConfig = DifficultConfig.getEnemyConfigByStage(Player.player.getDistanceStage());
            var enemy: EnemySprite = null;
            if (bombEnemyIndex == i) {
                enemyConfig = EnemyConfig.enemyConfig.enemyBomb;
                Player.player._createBombEnemy = false;
            } else if (worstEnemyIndex == i || worstEnemyIndex2 == i) {
                enemyConfig = DifficultConfig.getEnemyConfigByStage(0);
            }
            enemy = this.createEnemy(enemyConfig);
            if (enemy) {
                //设置坐标
                let point: cc.Vec2 = formation[i];
                enemy.node.x = point.x;
                enemy.node.y = point.y + this.node.height / 2 + CommonConfig.ENEMY_HEIGHT * 3;
                //设置血量、经验和掉落
                let dropItem = dropItemArray[i];
                if (Player.player._spurt && Math.random() < 0.9) {
                    dropItem = null;
                }
                enemy.setDynamicData(DifficultConfig.getEnemyHPByPower(enemy._enemyConfig), 1, dropItem);
            }
        }
    }

    scheduleRockGroup() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._levelUpIng || Player.player._bossIng) return;
        var rockList = DifficultConfig.getRockConfigByStage();
        var actionList = [];
        for (var i = 0; i < rockList.length; i++) {
            var createRockAction = cc.callFunc(
                function () {
                    for (var k = 0; k < this.list.length; k++) {
                        var bornIndex = this.list[k];
                        var bFollow = false;
                        if (typeof (bornIndex) == "string") bFollow = true;
                        let fightScene = FightScene.getFightScene().getComponent(FightScene);
                        fightScene.createRock(bFollow, bornIndex);
                    }
                    //在同一批次的陨石给音效
                    GameUtil.playEffect(SoundConfig.alert_big);
                },
                {list: rockList[i]}
            );
            actionList.push(cc.delayTime(CommonConfig.ROCK_DELAY));
            actionList.push(createRockAction);
        }
        this.node.runAction(cc.sequence(actionList));
    }

    //创建陨石
    createRock(bFollow, bornIndex) {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._levelUpIng) return;
        var line: RockLineSprite = this.createRockLineSprite();
        line._bFollow = bFollow;
        var bornX = -CommonConfig.WIDTH/2 + line.node.width / 2 + bornIndex * line.node.width;
        line.node.setPosition(bornX, this.node.height / 2);
        var lineAction = cc.callFunc(function () {
                //创建陨石的动作
                var createRockAction = cc.callFunc(function (sender) {
                        let fightScene: FightScene = FightScene.getFightScene().getComponent(FightScene);
                        var rock: RockSprite = fightScene.createRockSprite();
                        if (rock) {
                            rock.node.setPosition(sender.x, sender.y + rock.node.height);
                        }
                        sender.active = false;
                        //警告消失，陨石落下的时候，给音效
                        GameUtil.playEffect(SoundConfig.meteor);
                    }
                );
                //line宽 缩小到0
                this.node.runAction(cc.sequence(
                    cc.scaleTo(0.5, 0, this.scaleY),
                    createRockAction,
                    cc.callFunc(line.destroySprite, line)
                ));
            }, line
        );

        line.warningSprite.node.runAction(cc.sequence(
            cc.blink(1, 3),
            cc.callFunc(function (sender) {
                sender.active = false;
            }),
            lineAction
        ));
    }

    //定时创建特殊飞机
    scheduleBlessEnemy() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._levelUpIng || Player.player._bossIng) return;
        var enemyConfigObj: any = DifficultConfig.blessEnemyArr[CommonUtil.random(0, DifficultConfig.blessEnemyArr.length - 1)];
        if (enemyConfigObj.id == EnemyConfig.enemyConfig.enemyBomb.id) {
            Player.player._createBombEnemy = true;
        } else if (enemyConfigObj.id == EnemyConfig.enemyConfig.enemyBox.id) {
            let enemy: EnemySprite = this.createEnemy(enemyConfigObj);
            //设置坐标
            var startPosition = enemy["getStartPosition"](enemy)
            enemy.node.setPosition(startPosition);
            //设置血量、经验和掉落
            var hp = enemy._enemyConfig.HPArray[Player.player.getGrade() - 1] * CommonConfig.BULLET_COUNT_PER;
            enemy.setDynamicData(hp, 1, DifficultConfig.createSpecialEnemyDrop(enemy));
        }
    }

    //定时创建特殊飞机
    scheduleStayEnemy() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._levelUpIng || Player.player._bossIng) return;
        var enemy = this.createEnemy(DifficultConfig.stayEnemyArr[CommonUtil.random(0, DifficultConfig.stayEnemyArr.length - 1)]);
        if (!enemy) return;
        //设置坐标
        var startPosition = new cc.Vec2(CommonUtil.random(-this.node.width/2+enemy.node.width/2, this.node.width/2 - enemy.node.width/2),
            this.node.height/2 + enemy.node.height);
        enemy.node.setPosition(startPosition);
        //设置血量、经验和掉落
        var hp = enemy._enemyConfig.HPArray[Player.player.getGrade() - 1] * CommonConfig.BULLET_COUNT_PER;
        enemy.setDynamicData(hp, 1, DifficultConfig.createSpecialEnemyDrop(enemy));
    }

    //根据飞行距离创建BOSS
    createBoos(distanceStage){
        let boss:BossEnemySprite = null;
        switch (distanceStage){
            case 1:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss1);
                break;
            case 12:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss2);
                break;
            case 16:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss3);
                break;
            case 20:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss1);
                break;
            case 25:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss2);
                break;
            case 30:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss3);
                break;
        }
        if(!boss) return;
        //设置坐标
        var startPosition = new cc.Vec2(0, this.node.height/2+boss.node.height*2);
        boss.node.setPosition(startPosition);
        //设置血量、经验和掉落
        var hp = boss._enemyConfig.HPArray[Player.player.getGrade()-1]*CommonConfig.BULLET_COUNT_PER;
        boss.setDynamicData(hp, 1, DifficultConfig.createSpecialEnemyDrop(boss));
        Player.player._bossIng = true;
    }
    /*
   清屏（清除陨石，所有敌机、子弹、陨石爆炸）
    cleanType: 清理类型----不传参数为所有都清理1为只清理岩石，2为只清理敌机，3为只清理普通敌机（不清理特殊飞机）
    drop：是否掉落----不传参数为 不掉落，传参数true为掉落
    */
    cleanEnemy(cleanType:CLEAN_TYPE, bDrop:boolean){
        var childrenArray:cc.Node[] = this.node.children;
        let rockLineSprite:RockLineSprite = null;
        let rockSprite:RockSprite = null;
        let enemy:EnemySprite = null;
        for(let key in childrenArray){
            if(cleanType==CLEAN_TYPE.ALL||cleanType==CLEAN_TYPE.ROCK){
                rockLineSprite = childrenArray[key].getComponent(RockLineSprite);
                if(rockLineSprite){
                    rockLineSprite.destroySprite();
                }
                rockSprite = childrenArray[key].getComponent(RockSprite);
                if(rockSprite){
                    rockSprite.destroySprite();
                }
            }
            if(cleanType==CLEAN_TYPE.ALL||cleanType==CLEAN_TYPE.ENEMY||cleanType==CLEAN_TYPE.ENEMY_WITHOUT_SPECIAL){
                enemy = childrenArray[key].getComponent(EnemySprite);
                if(enemy){
                    if(enemy._enemyConfig.classType==EnemySprite){
                        enemy.hurt(-1, bDrop)
                        enemy.destroySprite();
                    }else {
                        if(cleanType==CLEAN_TYPE.ENEMY_WITHOUT_SPECIAL){
                            enemy.hurt(-1, bDrop)
                            enemy.destroySprite();
                        }
                    }
                }
            }
        }
    }

    onGameOver(){
        // cc.audioEngine.stopAllEffects();
        // g_sharedGameLayer._ship.stopAllActions();
        // g_sharedGameLayer.stopAllActions();
        // cc.director.runScene(new cc.TransitionFade(0.5, ResultLayer.scene()));
    }

    //杀敌奖励
    killEnemyAward(enemySprite){
        var exp = enemySprite._expValue;
        //冲刺等阶段 经验降低
        if(Player.player._spurt||Player.player._bomb||Player.player._spurtReadying){
            exp = enemySprite._expValue/3;
            if(Player.player._startSpurtDuration||Player.player._deathSpurtDuration){
                exp = 0;
            }
        }
        let fightUI:FightUI = FightUI.getFightUI();
        if(exp>0){
            //获得经验
            Player.player.addExp(exp);
            //经验球
            var expBall = GameUtil.getEnemyExp();
            if(expBall){
                expBall.x = enemySprite.x;
                expBall.y = enemySprite.y;
                expBall.scale = 1;
                var x = 40.5 + fightUI.expBar.progress / 100 * fightUI.expBar.node.width;
                var moveTo = cc.moveTo(0.7, new cc.Vec2(x, 540));
                var scaleTo = cc.scaleTo(0.7, 0.4);
                expBall.runAction(cc.sequence(
                    cc.delayTime(0.3),
                    cc.spawn(scaleTo, moveTo),
                    cc.callFunc(function(){
                        expBall.setVisible(false);
                    })
                ));
            }
        }

        //掉落物品
        for(var i=0;i<enemySprite._dropItems.length;i++){
            var item = this.createItemSprite(enemySprite._dropItems[i]);
            if(!item) continue;
            item.node.x = enemySprite.x;
            item.node.y = enemySprite.y;
            //多个暴落物的话，散开
            if(i!=0){
                item.node.x += CommonUtil.random(-100,100);
                item.node.y += CommonUtil.random(0,100);
            }
            item.drop();
        }
    }
}
