import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {CommonConfig} from "../configs/CommonConfig";
import BulletSprite from "../sprites/BulletSprite";
import {PlaneConfig} from "../configs/PlaneConfig";
import ShipSprite from "../sprites/ShipSprite";
import {IMediator} from "../framework/mvc/IMediator";
import {GameEvent} from "../common/GameEvent";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {SoundConfig} from "../configs/SoundConfig";
import {EnemyConfig} from "../configs/EnemyConfig";
import {FormationConfig} from "../configs/FormationConfig";
import EnemySprite from "../sprites/EnemySprite";
import {CommonUtil} from "../common/CommonUtil";
import {ItemConfig} from "../configs/ItemConfig";
import {DifficultConfig} from "../configs/DifficultConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class FightScene extends cc.Component implements IMediator{

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
    @property(cc.SpriteAtlas)
    enemyAtlas: cc.SpriteAtlas = null;

    bulletPool: cc.NodePool = new cc.NodePool();
    enemyPool: cc.NodePool = new cc.NodePool();

    getCommands():string[] {
        return [GameEvent.SPURT_ACTION, GameEvent.DOUBLE_FIRE_ACTION, GameEvent.XTS_ACTION, GameEvent.EAT_ITEM,
        GameEvent.STORE_REVIVE, GameEvent.STORE_SPURT, GameEvent.STORE_DEATH, GameEvent.STORE_CHANGE_PLANE];
    }

    onSpurtAction(){
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
    onDoubleFireAction(){
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
    onXTSAction(){
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
    onEatItem(itemConfig){
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
    onStoreRevive(){
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
    onStoreSpurt(){
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
    onStoreDeath(){
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
    onStoreChangePlane(){
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
    protected onLoad(): void {
        //切换背景音乐
        GameUtil.playMusic(SoundConfig.fightMusic_mp3);
        ObserverManager.registerObserverFun(this);

        this.setBackground();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);

        this.initPlayer();
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.schedule(this.scheduleNormalEnemy, CommonConfig.ENEMY_DELAY);
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

        // this.storeItemEffect("start");
        //
        //
        // //初始化战斗UI
        // g_FightUILayer.initUI();
        // //登场
        // this._ship.comeOnStage();
    }

    // //商城道具效果(开局时)
    // storeItemEffect(state):boolean {
    //     let triggerSuccess = false;
    //     //随机道具
    //     let item = VVV.getStoreItemConfig(g_player.randomItemID);
    //     if(item&&item.trigger==state){
    //         item.itemFunction();
    //         g_player.randomItemID = 0;
    //         triggerSuccess = true;
    //     }
    //     //购买的道具
    //     for(var i=0; i<g_player.data.storeItemPackage.length; i++){
    //         var itemObj = g_player.data.storeItemPackage[i];
    //         item = VVV.getStoreItemConfig(itemObj.itemID);
    //         if(item.trigger==state){
    //             if(g_player.useStoreItem(itemObj.itemID)){
    //                 triggerSuccess = true;
    //             }
    //         }
    //     }
    //     return triggerSuccess;
    // }

    onTouchBegan(event) {
    }

    onTouchMoved(event) {
        let target = this.ship.node;
        let touch = event.currentTouch;
        let delta = touch.getDelta();
        let curPos = new cc.Vec2(target.x, target.y);
        curPos = curPos.addSelf(delta)
        let shipHalfWidth = target.width / 2;
        let shipHalfHeight = target.height / 2;
        curPos = curPos.clampf(new cc.Vec2(-CommonConfig.WIDTH / 2 + shipHalfWidth * 2, -CommonConfig.HEIGHT / 2 + shipHalfHeight),
            new cc.Vec2(CommonConfig.WIDTH / 2 - shipHalfWidth * 2, CommonConfig.HEIGHT / 2 - shipHalfHeight));
        target.x = curPos.x;
        target.y = curPos.y;
    }

    //根据飞行距离加速敌机速度
    public addEnemySpeed(distanceStage){
        switch (distanceStage){
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
        let bullet = this.createBullet();
        bullet.x = this.ship.node.x;
        bullet.y = this.ship.node.y + this.ship.node.width / 2;
    }

    createBullet(): cc.Node {
        let bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(bullet);
        let bulletSprite = bullet.getComponent('BulletSprite');
        bulletSprite.initBullet(bullet, this.bulletAtlas, this.bulletPool);
        let planeConfig = PlaneConfig.getPlaneConfig(Player.player.data.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getGrade(Player.player.data.currentPlaneID));
        return bullet;
    }
    createEnemy(enemyConfig:any): EnemySprite {
        let spritePrefab = null;
        if (this.enemyPool.size() > 0) {
            spritePrefab = this.enemyPool.get();
        } else {
            spritePrefab = cc.instantiate(this.enemyPrefab);
        }
        this.node.addChild(spritePrefab);
        let enemySprite:EnemySprite = spritePrefab.getComponent('EnemySprite');
        enemySprite.initSprite(spritePrefab, this.enemyAtlas, this.enemyPool, enemyConfig);
        enemySprite.setSpriteFrame();
        return enemySprite;
    }

    moveBackground(dt){
        if(Player.player._changePlaneIng) return;
        if(Player.player._death) return;
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);

        //记录飞行距离
        var showSpeed = Player.player._spurt?CommonConfig.DISTANCE_SPURT_SPEED:CommonConfig.DISTANCE_SPEED;
        Player.player.currentDistance += showSpeed*dt;
        var tempForRound = Math.round(Player.player.currentDistance);
        ObserverManager.sendNotification(GameEvent.MOVE_BG, tempForRound);
        //每500M报数
        if(Player.player.getDistanceStage()>Player.player._preDistanceStage){
            Player.player._preDistanceStage = Player.player.getDistanceStage();
            //普通飞机速度变快
            this.addEnemySpeed(Player.player._preDistanceStage);
            //创建BOSS
            // this.createBoos(Player.player._preDistanceStage);TODO
            //创建新飞机预设
            // EnemySprite.presetDynamic(this._preDistanceStage);
        }
    }

    //定时创建普通飞机
    scheduleNormalEnemy(){
        //升级状态中 不创建
        if(Player.player._levelUpIng) return;
        var formation = FormationConfig.formationConfig[CommonUtil.random(0, FormationConfig.formationConfig.length-1)];
        var dropItemArray = DifficultConfig.getDropItemArray(formation.length);
        //五架飞机中必有一个最低级飞机
        var worstEnemyIndex = CommonUtil.random(0, formation.length-1);
        //一定几率出现两个最低级飞机(如果重复，这这次只有一架)
        var worstEnemyIndex2 = CommonUtil.random(0, formation.length-1);
        //一定几率创建自爆飞机
        var bombEnemyIndex = -1;
        if(Player.player._createBombEnemy){
            bombEnemyIndex = CommonUtil.random(0, formation.length-1);
        }
        for(var i=0; i<formation.length; i++){
            var enemyConfig = DifficultConfig.getEnemyConfigByStage(Player.player.getDistanceStage());
            var enemy:EnemySprite = null;
            if(bombEnemyIndex==i){
                enemyConfig = EnemyConfig.enemyConfig.enemyBomb;
                Player.player._createBombEnemy = false;
            }else if(worstEnemyIndex==i || worstEnemyIndex2==i){
                enemyConfig = DifficultConfig.getEnemyConfigByStage(0);
            }
            enemy = this.createEnemy(enemyConfig);
            if(enemy){
                //设置坐标
                let point:cc.Vec2 = formation[i];
                enemy.node.x = point.x;
                enemy.node.y = point.y + CommonConfig.HEIGHT/2 + CommonConfig.ENEMY_HEIGHT*3;
                //设置血量、经验和掉落
                let dropItem = dropItemArray[i];
                if(Player.player._spurt&&Math.random()<0.9){
                    dropItem = null;
                }
                enemy.setDynamicData(DifficultConfig.getEnemyHPByPower(enemy._enemyConfig), 1, dropItem);
            }
        }
    }

    public createSpecialEnemyDrop(enemySprite){
        // var dropArray = [];
        // if(enemySprite._enemyConfig == EnemyConfig.enemyBox){
        //     dropArray.push(ItemConfig.item_green);
        //     dropArray.push(ItemConfig.item_green);
        // }
        // if(!g_sharedGameLayer._itemDropArr || g_sharedGameLayer._itemDropArr.length==0){
        //     g_sharedGameLayer._itemDropArr = [];
        //     for(var k in ItemConfig){
        //         if(ItemConfig[k].gold) continue;
        //         g_sharedGameLayer._itemDropArr.push(ItemConfig[k]);
        //     }
        //     g_sharedGameLayer._itemDropArr.sort(function(){return Math.random()>0.5?-1:1;});
        // }
        // var item = g_sharedGameLayer._itemDropArr.shift();
        // dropArray.push(item);
        // return dropArray;
    };
}
