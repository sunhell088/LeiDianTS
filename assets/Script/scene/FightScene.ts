import {CommonUtil} from "../common/CommonUtil";
import {Player} from "../classes/Player";
import {EnemyConfig} from "../configs/EnemyConfig";
import {SoundConfig} from "../configs/SoundConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {FormationConfig} from "../configs/FormationConfig";
import EnemySprite from "../sprites/enemy/EnemySprite";
import {DifficultConfig} from "../configs/DifficultConfig";
import {GameUtil} from "../common/GameUtil";
import ShipSprite from "../sprites/ShipSprite";
import RockLineSprite from "../sprites/RockLineSprite";
import RockSprite from "../sprites/RockSprite";
import BossEnemySprite from "../sprites/enemy/BossEnemySprite";
import ItemSprite from "../sprites/ItemSprite";
import {IMediator} from "../framework/mvc/IMediator";
import {CLEAN_ENEMY_TYPE, ENEMY_TYPE} from "../common/GameEnum";
import {ConfigUtil} from "../common/ConfigUtil";
import {GameEvent} from "../common/GameEvent";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {ItemConfig} from "../configs/ItemConfig";
import FlexEnemySprite from "../sprites/enemy/FlexEnemySprite";
import StayEnemySprite from "../sprites/enemy/StayEnemySprite";
import {SceneManager} from "../manager/scene/SceneManager";
import FollowEnemySprite from "../sprites/enemy/FollowEnemySprite";
import {GuideConfig} from "../configs/GuideConfig";
import {DialogConfig} from "../configs/DialogConfig";
import {DialogManager} from "../manager/widget/DialogManager";
import {GuideTriggerEvent} from "../common/GuideTriggerEvent";
import {GuideManager} from "../manager/guide/GuideManager";


const {ccclass, property} = cc._decorator;
@ccclass
export default class FightScene extends cc.Component implements IMediator {

    @property(cc.Sprite)
    background0: cc.Sprite = null;
    @property(cc.Sprite)
    background1: cc.Sprite = null;
    @property(cc.Sprite)
    bombEffect: cc.Sprite = null;
    @property(cc.Sprite)
    darkSprite: cc.Sprite = null;
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
    bulletHitEffectPrefab: cc.Prefab = null;

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
    enemyExplodePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    enemyExplode2Prefab: cc.Prefab = null;
    @property(cc.Animation)
    playerDeadExplodeSprite: cc.Animation = null;

    @property(cc.Prefab)
    playerBombRainPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    shipShadowPrefab: cc.Prefab = null;

    //只支持最多5个
    private shipShadowList: cc.Node[] = [];
    private bulletPool: cc.NodePool = new cc.NodePool();
    private bulletHitEffectPool: cc.NodePool = new cc.NodePool();
    private enemyPool: cc.NodePool = new cc.NodePool();
    private enemyFlexPool: cc.NodePool = new cc.NodePool();
    private enemyBossPool: cc.NodePool = new cc.NodePool();
    private enemyFollowPool: cc.NodePool = new cc.NodePool();
    private enemyStayPool: cc.NodePool = new cc.NodePool();
    private rockLinePool: cc.NodePool = new cc.NodePool();
    private rockPool: cc.NodePool = new cc.NodePool();
    private itemPool: cc.NodePool = new cc.NodePool();
    private enemyExplodePool: cc.NodePool = new cc.NodePool();
    private playerBombRainPool: cc.NodePool = new cc.NodePool();
    private planeShadowPool: cc.NodePool = new cc.NodePool();
    //双击状态
    private _clicked:boolean = false;

    getCommands() {
        return [GameEvent.KILL_ENEMY, GameEvent.PROTECT_EFFECT, GameEvent.GAME_OVER,
            GameEvent.BULLET_HIT_ENEMY, GameEvent.ITEM_COLLISION_PLAYER, GameEvent.EAT_ITEM, GameEvent.SPURT_DURATION
        ,GameEvent.FOCUS_ENEMY,GameEvent.FOCUS_ITEM];
    }

    protected onLoad(): void {
        ObserverManager.registerObserverFun(this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.schedule(this.scheduleNormalEnemy, CommonConfig.ENEMY_DELAY);
        if(!Player.player.hasFinishGuide(GuideConfig.guideConfig.minLevelEnemyOver2.name)){
            this.scheduleOnce(this.scheduleBlessEnemy, 10);
            this.scheduleOnce(this.scheduleFollowEnemy, 20);
            this.scheduleOnce(this.scheduleBombEnemy, 30);
            this.scheduleOnce(this.scheduleStayEnemy, 40);
            this.scheduleOnce(this.scheduleRockGroup, 50);
            this.scheduleOnce(function () {
                this.scheduleOnce(this.scheduleBlessEnemy, 10);
                this.scheduleOnce(this.scheduleFollowEnemy, 20);
                this.scheduleOnce(this.scheduleBombEnemy, 30);
                this.schedule(this.scheduleRockGroup, CommonConfig.ROCK_CONFIG_DELAY);
            }, 50)
        }else {
            this.schedule(this.scheduleBlessEnemy, CommonConfig.BLESS_PLANE_DELAY);
            this.schedule(this.scheduleFollowEnemy, CommonConfig.FOLLOW_ENEMY_DELAY);
            this.schedule(this.scheduleBombEnemy, CommonConfig.BLESS_BOMB_DELAY);
            this.schedule(this.scheduleStayEnemy, CommonConfig.STAY_ENEMY_DELAY);
            this.schedule(this.scheduleRockGroup, CommonConfig.ROCK_CONFIG_DELAY);
        }


        //定时刷新各类buff进度条
        this.schedule(this.scheduleBuff, 0.1);
        this.init();
    }

    protected onDisable(): void {
        ObserverManager.unRegisterObserverFun(this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.unschedule(this.shoot);
        this.unschedule(this.scheduleNormalEnemy);
        this.unschedule(this.scheduleRockGroup);
        this.unschedule(this.scheduleBombEnemy);
        this.unschedule(this.scheduleFollowEnemy);
        this.unschedule(this.scheduleBlessEnemy);
        this.unschedule(this.scheduleStayEnemy);
        this.unschedule(this.scheduleBuff);
    }

    protected update(dt) {
        this.moveBackground(dt);
    }

    protected init() {
        //切换背景音乐
        GameUtil.playMusic(SoundConfig.fightMusic_mp3 + "" + CommonUtil.random(0, 2));
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.initPlayer();
    }
    private moveBackground(dt) {
        if (Player.player._death) return;
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);

        //记录飞行距离
        var showSpeed = Player.player._spurt ? CommonConfig.DISTANCE_SPURT_SPEED : CommonConfig.DISTANCE_SPEED;
        Player.player.currentDistance += showSpeed * dt;
        if (Player.player.currentDistance >= CommonConfig.MAX_DISTANCE) {
            Player.player.currentDistance = CommonConfig.MAX_DISTANCE;
        }
        ObserverManager.sendNotification(GameEvent.MOVE_BG, Math.round(Player.player.currentDistance));
        //每500M报数
        if (Player.player.getDistanceStage() > Player.player._preDistanceStage) {
            Player.player._preDistanceStage = Player.player.getDistanceStage();
            ObserverManager.sendNotification(GameEvent.UPDATE_DISTANCE_STAGE)
            //普通飞机速度变快
            this.addEnemySpeed(Player.player._preDistanceStage);
            //创建BOSS
            this.createBoss(Player.player._preDistanceStage);
        }
    }

    //定时创建普通飞机
    protected scheduleNormalEnemy() {
        var formation = FormationConfig.formationConfig[CommonUtil.random(0, FormationConfig.formationConfig.length - 1)];
        //五架飞机中必有一个最低级飞机
        var worstEnemyIndex = CommonUtil.random(0, formation.length - 1);
        //一定几率出现两个最低级飞机(如果重复，这次只有一架)
        var worstEnemyIndex2 = CommonUtil.random(0, formation.length - 1);
        for (var i = 0; i < formation.length; i++) {
            var enemyConfig: any = ConfigUtil.getEnemyConfigByStage(Player.player.getDistanceStage());
            var enemy: EnemySprite = null;
            if (worstEnemyIndex == i || worstEnemyIndex2 == i) {
                enemyConfig = ConfigUtil.getEnemyConfigByStage(0);
            }
            enemy = this.createEnemy(enemyConfig);
            let point: cc.Vec2 = formation[i];
            enemy.node.x = point.x;
            enemy.node.y = point.y + this.node.height / 2 + CommonConfig.ENEMY_HEIGHT * 3;
            enemy.setDynamicData(ConfigUtil.getEnemyHP(enemy._enemyConfig), ConfigUtil.createSpecialEnemyDrop(enemy));
            GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_ENEMY_APPEAR, enemyConfig.id);
        }
    }

    //定时创建炸弹飞机(只在屏幕两边产生)
    protected scheduleBombEnemy() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._spurt || Player.player._spurtReadying || Player.player._bossIng) return;
        var enemySpriteSct = this.createEnemy(EnemyConfig.enemyConfig.enemyBomb);
        //设置坐标
        let posX: number = CommonUtil.random(0, 1) == 0 ? -this.node.width / 2 + enemySpriteSct.node.width : this.node.width / 2 - enemySpriteSct.node.width;
        var startPosition = new cc.Vec2(posX, this.node.height / 2 + enemySpriteSct.node.height);
        enemySpriteSct.node.setPosition(startPosition);
        enemySpriteSct.setDynamicData(ConfigUtil.getEnemyHP(enemySpriteSct._enemyConfig), ConfigUtil.createSpecialEnemyDrop(enemySpriteSct));
        this.scheduleOnce(function () {
            GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_ENEMY_APPEAR, EnemyConfig.enemyConfig.enemyBomb.id);
        }, 2);
    }

    //定时创建福利飞机
    protected scheduleBlessEnemy() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._spurt || Player.player._spurtReadying || Player.player._bossIng) return;
        let enemy: EnemySprite = this.createEnemy(EnemyConfig.enemyConfig.enemyBox);
        //设置坐标
        var startPosition = enemy["getStartPosition"](enemy)
        enemy.node.setPosition(startPosition);
        enemy.setDynamicData(ConfigUtil.getEnemyHP(enemy._enemyConfig), ConfigUtil.createSpecialEnemyDrop(enemy));

        this.scheduleOnce(function () {
            GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_ENEMY_APPEAR, EnemyConfig.enemyConfig.enemyBox.id);
        }, 1.5);
    }

    //定时创建停留飞机
    protected scheduleStayEnemy() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._spurt || Player.player._spurtReadying || Player.player._bossIng) return;
        var enemySpriteSct = this.createEnemy(DifficultConfig.stayEnemyArr[CommonUtil.random(0, DifficultConfig.stayEnemyArr.length - 1)]);
        //设置坐标
        var startPosition = new cc.Vec2(0, this.node.height / 2 + enemySpriteSct.node.height);
        enemySpriteSct.node.setPosition(startPosition);
        enemySpriteSct.setDynamicData(ConfigUtil.getEnemyHP(enemySpriteSct._enemyConfig), ConfigUtil.createSpecialEnemyDrop(enemySpriteSct));
        this.scheduleOnce(function () {
            GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_ENEMY_APPEAR, enemySpriteSct._enemyConfig.id);
        }, 2);
    }

    //定时创建追踪飞机
    protected scheduleFollowEnemy() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._spurt || Player.player._spurtReadying || Player.player._bossIng) return;
        var enemySpriteSct = this.createEnemy(EnemyConfig.enemyConfig.enemyFollow);
        //设置坐标
        var startPosition = new cc.Vec2(CommonUtil.random(-this.node.width / 2 + enemySpriteSct.node.width / 2, this.node.width / 2 - enemySpriteSct.node.width / 2),
            this.node.height / 2 + enemySpriteSct.node.height);
        enemySpriteSct.node.setPosition(startPosition);
        enemySpriteSct.setDynamicData(ConfigUtil.getEnemyHP(enemySpriteSct._enemyConfig), ConfigUtil.createSpecialEnemyDrop(enemySpriteSct));
        this.scheduleOnce(function () {
            GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_ENEMY_APPEAR, EnemyConfig.enemyConfig.enemyFollow.id);
        }, 1.5);
    }

    //定时创建陨石掉落组
    protected scheduleRockGroup() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._bossIng) return;
        var rockList = ConfigUtil.getRockConfigByStage();
        var actionList = [];
        for (var i = 0; i < rockList.length; i++) {
            var createRockAction = cc.callFunc(
                function (fightSceneNode, list) {
                    for (var k = 0; k < list.length; k++) {
                        var bornIndex = list[k];
                        var bFollow = false;
                        if (typeof (bornIndex) == "string") bFollow = true;
                        this.createRock(bFollow, bornIndex);
                    }
                    //在同一批次的陨石给音效
                    GameUtil.playSound(SoundConfig.alert_big);
                }, this, rockList[i]
            );
            actionList.push(cc.delayTime(CommonConfig.ROCK_DELAY));
            actionList.push(createRockAction);
        }
        this.node.runAction(cc.sequence(actionList));
        this.scheduleOnce(function () {
            GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_ROCK_APPEAR);
        }, 2.5)
    }

    //根据飞行距离创建BOSS
    private createBoss(distanceStage) {
        let boss: BossEnemySprite = null;
        switch (distanceStage) {
            case 10:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss1);
                break;
            case 14:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss2);
                break;
            case 20:
                boss = this.createEnemy(EnemyConfig.enemyConfig.enemyBoss3);
                break;
        }
        if (!boss) return;
        Player.player._bossIng = true;
        //设置坐标
        var startPosition = new cc.Vec2(0, this.node.height / 2 + boss.node.height * 2);
        boss.node.setPosition(startPosition);
        boss.setDynamicData(ConfigUtil.getEnemyHP(boss._enemyConfig), ConfigUtil.createSpecialEnemyDrop(boss));
        Player.player._bossIng = true;
    }

    //根据飞行距离加速敌机速度
    private addEnemySpeed(distanceStage) {
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

    //发射子弹
    protected shoot() {
        if (Player.player._stopBullet) return;
        if (Player.player._death) return;
        this.shootReal(this.ship.node);
        for (let key in this.shipShadowList) {
            this.shootReal(this.shipShadowList[key])
        }
    }

    //发射子弹
    private shootReal(ship: cc.Node) {
        let bullet = this.createBullet();
        bullet.x = ship.x;
        bullet.y = ship.y + ship.height / 2;

        //双倍火力二条
        var bullet2: cc.Node = null;
        if (Player.player._doubleFire) {
            bullet.x = ship.x - bullet.width / 2;
            bullet2 = this.createBullet();
            bullet2.x = ship.x + bullet2.width / 2;
            bullet2.y = ship.y + ship.height / 2;
        }
    }

    //根据player信息初始化显示对象
    private initPlayer() {
        Player.player._death = false;
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        this.ship.shipSprite.spriteFrame = this.shipAtlas.getSpriteFrame(planeConfig.fightTextureName);
        this.ship.node.setPosition(0, 0);
        planeConfig.planeFunction(this.ship);

        //重置和战斗相关的数据
        Player.player.resetFightData();

        //登场
        this.ship.init();
    }

    //创建陨石
    private createRockLineSprite(): RockLineSprite {
        let spriteNode: cc.Node = null;
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

    private createRockSprite(): RockSprite {
        let spriteNode: cc.Node = null;
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

    //清屏（清除陨石，所有敌机、子弹、陨石爆炸）
    private cleanEnemy(cleanType: number, bDrop: boolean = true) {
        var childrenArray: cc.Node[] = this.node.children;
        let rockLineSprite: RockLineSprite = null;
        let rockSprite: RockSprite = null;
        let enemy: EnemySprite = null;
        let rockLineSpriteList: RockLineSprite[] = [];
        let rockSpriteList: RockSprite[] = [];
        let enemyList: EnemySprite[] = [];
        for (let key in childrenArray) {
            if ((cleanType & ENEMY_TYPE.NORMAL_ENEMY) != 0) {
                enemy = childrenArray[key].getComponent(EnemySprite);
                if(enemy&&enemy._enemyConfig.enemyClassName=="EnemySprite"){
                    enemyList.push(enemy);
                }
            }
            if ((cleanType & ENEMY_TYPE.ROCK) != 0) {
                rockLineSprite = childrenArray[key].getComponent(RockLineSprite);
                if (rockLineSprite) {
                    rockLineSpriteList.push(rockLineSprite);
                }
                rockSprite = childrenArray[key].getComponent(RockSprite);
                if (rockSprite) {
                    rockSpriteList.push(rockSprite);
                    rockSprite.destroySprite();
                }
            }
            //宝箱飞机
            if ((cleanType & ENEMY_TYPE.BLESS_ENEMY) != 0) {
                enemy = childrenArray[key].getComponent(FlexEnemySprite);
                if(enemy){
                    enemyList.push(enemy);
                }
            }
            //追踪飞机
            if ((cleanType & ENEMY_TYPE.FOLLOW_ENEMY) != 0) {
                enemy = childrenArray[key].getComponent(FollowEnemySprite);
                if(enemy){
                    enemyList.push(enemy);
                }
            }
            //停留飞机
            if ((cleanType & ENEMY_TYPE.STAY_ENEMY) != 0) {
                enemy = childrenArray[key].getComponent(StayEnemySprite);
                if(enemy){
                    enemyList.push(enemy);
                }
            }
        }
        for (let key in rockLineSpriteList) {
            rockLineSpriteList[key].destroySprite();
        }
        for (let key in rockSpriteList) {
            rockSpriteList[key].destroySprite();
        }
        for (let key in enemyList) {
            enemyList[key].hurt(-1, bDrop);
        }
    }

    //创建炸弹效果
    private createBombRain() {
        //音效
        GameUtil.playSound(SoundConfig.useBomb);
        Player.player._bomb = true;
        this.cleanEnemy(CLEAN_ENEMY_TYPE.ALL, true);
        //屏幕变暗
        this.darkSprite.node.active = true;
        //创建光圈并且变大
        this.bombEffect.node.active = true;
        this.bombEffect.node.scale = 1
        this.bombEffect.node.setPosition(this.ship.node.x, this.ship.node.y);
        cc.tween(this.bombEffect.node).by(0.6, {scale: 30}).start();
        //创建炸弹效果
        let tweenCreateBomb = cc.tween();
        for (var i = 0; i < CommonConfig.PRESET_COUNT_BOMB; i++) {

            tweenCreateBomb.call(function () {
                let bomb: cc.Node = this.createPlayerBombRainSprite(Player.player.data.currentPlaneID);
                bomb.setPosition(GameUtil.randomWidth(bomb), -CommonConfig.HEIGHT / 2 - bomb.height);
                bomb.runAction(cc.sequence(
                    cc.moveBy(CommonConfig.ROCK_BOMB_SPEED, new cc.Vec2(0, CommonConfig.HEIGHT - bomb.height)),
                    cc.callFunc(function (sender) {
                        bomb.stopAllActions()
                        this.playerBombRainPool.put(bomb);
                    }, this)
                ));
                // @ts-ignore
            }, this);
            tweenCreateBomb.delay(0.2)
        }
        tweenCreateBomb.call(function () {
            this.darkSprite.node.active = false;
            this.bombEffect.node.active = false;
            Player.player._bomb = false;
            // @ts-ignore
        }, this);
        cc.tween(this.node).then(tweenCreateBomb).start();
    }

    //杀敌奖励
    private doKillEnemyAward(enemySprite: EnemySprite) {
        //掉落物品
        for (var i = 0; i < enemySprite._dropItems.length; i++) {
            var item: ItemSprite = this.createItemSprite(enemySprite._dropItems[i]);
            //如果在冲刺中，则只爆金币类
            if (Player.player._spurt || Player.player._spurtReadying) {
                if (!item._itemConfig.gold) continue;
            }
            item.setSpriteFrame();
            item.node.x = enemySprite.node.x;
            item.node.y = enemySprite.node.y;
            //多个暴落物的话，散开
            if (i != 0) {
                item.node.x += CommonUtil.random(-100, 100);
                item.node.y += CommonUtil.random(0, 100);
            }
            item.drop();
        }
    }

    protected onTouchMoved(event) {
        let oldX: number = this.ship.node.x;
        let oldY: number = this.ship.node.y;
        let shipSelf: cc.Node = this.ship.node;
        let touch = event.currentTouch;
        let delta = touch.getDelta();
        let oldPos = new cc.Vec2(shipSelf.x, shipSelf.y);
        let curPos = oldPos.addSelf(delta)
        let shipHalfWidth = shipSelf.width / 2;
        let shipHalfHeight = shipSelf.height / 2;
        curPos = curPos.clampf(new cc.Vec2(-this.node.width / 2 + shipHalfWidth, -this.node.height / 2 + shipHalfHeight),
            new cc.Vec2(this.node.width / 2 - shipHalfWidth, this.node.height / 2 - shipHalfHeight));
        shipSelf.x = curPos.x;
        shipSelf.y = curPos.y;

        this.onTouchMovedReal(oldX, oldY, curPos, this.shipShadowList[0])
    }

    private onTouchStart(event){
        let target:FightScene = event.getCurrentTarget().getComponent(FightScene);
        if(target._clicked){
            target.useBomb();
        }else{
            target._clicked = true;
            target.scheduleOnce(function(){ target._clicked = false; }, 0.25);
        }
        return true
    }

    private useBomb(){
        if(Player.player._bomb||Player.player._spurt||Player.player._spurtReadying) return;
        if(Player.player.bombCount<=0){
            //屏幕抖动，提示没有炸弹
            this.node.runAction(GameUtil.shakeBy(0.3,5,2))
        }else {
            Player.player.bombCount--;
            this.createBombRain();
            ObserverManager.sendNotification(GameEvent.USE_BOMB_EFFECT);
        }
    }


    private onTouchMovedReal(oldX, oldY, curPos: cc.Vec2, shadow) {
        if (!shadow) return;
        let oldShadowX = shadow.x;
        let oldShadowY = shadow.y;
        let offsetX: number = curPos.x - oldX;
        let offsetY: number = curPos.y - oldY;
        //如果往右边移动
        if (offsetX > 0) {
            //如果影子在右边
            if (shadow.x > curPos.x) {
                shadow.x -= offsetX;
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x -= offsetX;
                } else {
                    shadow.x += offsetX;
                }
            }
        }
        //如果往左边移动
        else {
            //如果影子在左边
            if (shadow.x < curPos.x) {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                }
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                } else {
                    shadow.x -= Math.abs(offsetX);
                }
            }
        }
        //如果往上边移动-------
        if (offsetY > 0) {
            //如果影子在上边
            if (shadow.y > curPos.y) {
                shadow.y -= offsetY;
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y -= offsetY;
                } else {
                    shadow.y += offsetY;
                }
            }
        }
        //如果往下边移动
        else {
            //如果影子在下边
            if (shadow.y < curPos.y) {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                }
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                } else {
                    shadow.y -= Math.abs(offsetY);
                }
            }
        }
        this.onTouchMovedReal2(oldShadowX, oldShadowY, shadow.getPosition(), this.shipShadowList[1])
    }

    private onTouchMovedReal2(oldX, oldY, curPos: cc.Vec2, shadow) {
        if (!shadow) return;
        let oldShadowX = shadow.x;
        let oldShadowY = shadow.y;
        let offsetX: number = curPos.x - oldX;
        let offsetY: number = curPos.y - oldY;
        //如果往右边移动
        if (offsetX > 0) {
            //如果影子在右边
            if (shadow.x > curPos.x) {
                shadow.x -= offsetX;
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x -= offsetX;
                } else {
                    shadow.x += offsetX;
                }
            }
        }
        //如果往左边移动
        else {
            //如果影子在左边
            if (shadow.x < curPos.x) {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                }
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                } else {
                    shadow.x -= Math.abs(offsetX);
                }
            }
        }
        //如果往上边移动-------
        if (offsetY > 0) {
            //如果影子在上边
            if (shadow.y > curPos.y) {
                shadow.y -= offsetY;
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y -= offsetY;
                } else {
                    shadow.y += offsetY;
                }
            }
        }
        //如果往下边移动
        else {
            //如果影子在下边
            if (shadow.y < curPos.y) {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                }
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                } else {
                    shadow.y -= Math.abs(offsetY);
                }
            }
        }
        this.onTouchMovedReal3(oldShadowX, oldShadowY, shadow.getPosition(), this.shipShadowList[2])
    }

    private onTouchMovedReal3(oldX, oldY, curPos: cc.Vec2, shadow) {
        if (!shadow) return;
        let oldShadowX = shadow.x;
        let oldShadowY = shadow.y;
        let offsetX: number = curPos.x - oldX;
        let offsetY: number = curPos.y - oldY;
        //如果往右边移动
        if (offsetX > 0) {
            //如果影子在右边
            if (shadow.x > curPos.x) {
                shadow.x -= offsetX;
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x -= offsetX;
                } else {
                    shadow.x += offsetX;
                }
            }
        }
        //如果往左边移动
        else {
            //如果影子在左边
            if (shadow.x < curPos.x) {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                }
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                } else {
                    shadow.x -= Math.abs(offsetX);
                }
            }
        }
        //如果往上边移动-------
        if (offsetY > 0) {
            //如果影子在上边
            if (shadow.y > curPos.y) {
                shadow.y -= offsetY;
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y -= offsetY;
                } else {
                    shadow.y += offsetY;
                }
            }
        }
        //如果往下边移动
        else {
            //如果影子在下边
            if (shadow.y < curPos.y) {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                }
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                } else {
                    shadow.y -= Math.abs(offsetY);
                }
            }
        }
        this.onTouchMovedReal4(oldShadowX, oldShadowY, shadow.getPosition(), this.shipShadowList[3]);
    }

    private onTouchMovedReal4(oldX, oldY, curPos: cc.Vec2, shadow) {
        if (!shadow) return;
        let oldShadowX = shadow.x;
        let oldShadowY = shadow.y;
        let offsetX: number = curPos.x - oldX;
        let offsetY: number = curPos.y - oldY;
        //如果往右边移动
        if (offsetX > 0) {
            //如果影子在右边
            if (shadow.x > curPos.x) {
                shadow.x -= offsetX;
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x -= offsetX;
                } else {
                    shadow.x += offsetX;
                }
            }
        }
        //如果往左边移动
        else {
            //如果影子在左边
            if (shadow.x < curPos.x) {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                }
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                } else {
                    shadow.x -= Math.abs(offsetX);
                }
            }
        }
        //如果往上边移动-------
        if (offsetY > 0) {
            //如果影子在上边
            if (shadow.y > curPos.y) {
                shadow.y -= offsetY;
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y -= offsetY;
                } else {
                    shadow.y += offsetY;
                }
            }
        }
        //如果往下边移动
        else {
            //如果影子在下边
            if (shadow.y < curPos.y) {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                }
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                } else {
                    shadow.y -= Math.abs(offsetY);
                }
            }
        }
        this.onTouchMovedReal5(oldShadowX, oldShadowY, shadow.getPosition(), this.shipShadowList[4]);
    }

    private onTouchMovedReal5(oldX, oldY, curPos: cc.Vec2, shadow) {
        if (!shadow) return;
        let oldShadowX = shadow.x;
        let oldShadowY = shadow.y;
        let offsetX: number = curPos.x - oldX;
        let offsetY: number = curPos.y - oldY;
        //如果往右边移动
        if (offsetX > 0) {
            //如果影子在右边
            if (shadow.x > curPos.x) {
                shadow.x -= offsetX;
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x -= offsetX;
                } else {
                    shadow.x += offsetX;
                }
            }
        }
        //如果往左边移动
        else {
            //如果影子在左边
            if (shadow.x < curPos.x) {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                }
            } else {
                if (Math.abs(curPos.x - shadow.x) < 50) {
                    shadow.x += Math.abs(offsetX);
                } else {
                    shadow.x -= Math.abs(offsetX);
                }
            }
        }
        //如果往上边移动-------
        if (offsetY > 0) {
            //如果影子在上边
            if (shadow.y > curPos.y) {
                shadow.y -= offsetY;
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y -= offsetY;
                } else {
                    shadow.y += offsetY;
                }
            }
        }
        //如果往下边移动
        else {
            //如果影子在下边
            if (shadow.y < curPos.y) {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                }
            } else {
                if (Math.abs(curPos.y - shadow.y) < 50) {
                    shadow.y += Math.abs(offsetY);
                } else {
                    shadow.y -= Math.abs(offsetY);
                }
            }
        }
    }

    //创建子弹复用对象
    private createBullet(): cc.Node {
        let spriteNode: cc.Node = null;
        if (this.bulletPool.size() > 0) {
            spriteNode = this.bulletPool.get();
        } else {
            spriteNode = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(spriteNode);
        let bulletSprite = spriteNode.getComponent('BulletSprite');
        bulletSprite.initSprite(spriteNode, this.bulletAtlas, this.bulletPool);
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID));
        return spriteNode;
    }

    //创建子弹击中效果复用对象
    private createBulletHitEffect(): cc.Node {
        let spriteNode: cc.Node = null;
        if (this.bulletHitEffectPool.size() > 0) {
            spriteNode = this.bulletHitEffectPool.get();
            spriteNode.active = true;
        } else {
            spriteNode = cc.instantiate(this.bulletHitEffectPrefab);
        }
        this.node.addChild(spriteNode);
        return spriteNode;
    }

    //创建敌机复用对象
    private createEnemy(enemyConfig: any): EnemySprite {
        let spriteNode: cc.Node = null;
        let enemySprite: EnemySprite = null;
        let enemyPrefab: cc.Prefab = this.enemyPrefab;
        let classNameStr: string = enemyConfig.enemyClassName;
        let pool: cc.NodePool = this.enemyPool;
        switch (classNameStr) {
            case "FlexEnemySprite":
                pool = this.enemyFlexPool;
                break;
            case "FollowEnemySprite":
                pool = this.enemyFollowPool;
                break;
            case "StayEnemySprite":
                pool = this.enemyStayPool;
                enemyPrefab = this.enemyStayPrefab;
                break;
            case "BossEnemySprite":
                pool = this.enemyBossPool;
                enemyPrefab = this.enemyBossPrefab;
                break;
        }

        if (pool.size() > 0) {
            spriteNode = pool.get();
            enemySprite = spriteNode.getComponent(classNameStr);
            spriteNode.active = true;
            spriteNode.opacity = 255;
            spriteNode.stopAllActions();
        } else {
            spriteNode = cc.instantiate(enemyPrefab);
            enemySprite = spriteNode.addComponent(classNameStr);
        }
        this.node.addChild(spriteNode);
        enemySprite.bloodBar = spriteNode.children[0].getComponent(cc.ProgressBar);
        enemySprite.initSprite(spriteNode, this.enemyAtlas, pool, enemyConfig);
        enemySprite.setSpriteFrame();
        return enemySprite;
    }

    //创建爆落复用对象
    private createItemSprite(itemConfig: any): ItemSprite {
        let spriteNode = null;
        if (this.itemPool.size() > 0) {
            spriteNode = this.itemPool.get();
            spriteNode.stopAllActions();
        } else {
            spriteNode = cc.instantiate(this.itemPrefab);
        }
        this.node.addChild(spriteNode);
        let itemSprite: ItemSprite = spriteNode.getComponent('ItemSprite');
        itemSprite.initSprite(spriteNode, this.itemAtlas, this.itemPool, itemConfig);
        return itemSprite;
    }

    //创建陨石复用对象
    private createRock(bFollow, bornIndex) {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying) return;
        var line: RockLineSprite = this.createRockLineSprite();
        line._bFollow = bFollow;
        var bornX = -CommonConfig.WIDTH / 2 + line.node.width / 2 + bornIndex * line.node.width;
        line.node.setPosition(bornX, this.node.height / 2);
        var lineAction = cc.callFunc(function (fightSceneNode: cc.Node, fightScene: FightScene) {
                //创建陨石的动作
                var createRockAction = cc.callFunc(function (sender, xxoo) {
                        var rock: RockSprite = fightScene.createRockSprite();
                        if (rock) {
                            rock.node.setPosition(sender.x, sender.y + rock.node.height);
                        }
                        sender.active = false;
                        //警告消失，陨石落下的时候，给音效
                        GameUtil.playSound(SoundConfig.meteor);
                    }, this
                );
                //line宽 缩小到0
                this.node.runAction(cc.sequence(
                    cc.scaleTo(0.5, 0, 0),
                    createRockAction,
                    cc.callFunc(line.destroySprite, line)
                ));
            }, line, this
        );

        line.warningSprite.node.runAction(cc.sequence(
            cc.blink(1, 3),
            cc.callFunc(function (sender) {
                sender.active = false;
            }),
            lineAction
        ));
    }

    //创建炸弹时炸弹雨复用对象
    private createPlayerBombRainSprite(planeID): cc.Node {
        let planeConfig: any = ConfigUtil.getPlaneConfig(planeID);
        let spriteNode: cc.Node = null;
        if (this.playerBombRainPool.size() > 0) {
            spriteNode = this.playerBombRainPool.get();
            spriteNode.stopAllActions();
        } else {
            spriteNode = cc.instantiate(this.playerBombRainPrefab);
        }
        let spriteSct: cc.Sprite = spriteNode.getComponent(cc.Sprite);
        spriteSct.spriteFrame = this.bulletAtlas.getSpriteFrame(planeConfig.bombType);
        this.node.addChild(spriteNode);
        return spriteNode;
    }

    //创建敌机爆炸复用对象
    private playEnemyExplodeAnimation(enemySprite: EnemySprite) {
        let explodeNode: cc.Node = null;
        if (this.enemyExplodePool.size() > 0) {
            explodeNode = this.enemyExplodePool.get();
        } else {
            explodeNode = cc.instantiate(this.enemyExplodePrefab);
        }
        this.node.addChild(explodeNode);

        explodeNode.setPosition(enemySprite.node.getPosition())
        let effectAnimation: cc.Animation = explodeNode.getComponent(cc.Animation);
        effectAnimation.on(cc.Animation.EventType.FINISHED, function () {
            this.enemyExplodePool.put(explodeNode);
            effectAnimation.off(cc.Animation.EventType.FINISHED);
        }, this);
        effectAnimation.play();
    }

    private setShadowStart() {
        let spriteNode: cc.Node = null;
        if (this.planeShadowPool.size() > 0) {
            spriteNode = this.planeShadowPool.get();
        } else {
            spriteNode = cc.instantiate(this.shipShadowPrefab);
        }
        this.shipShadowList.push(spriteNode);
        this.node.addChild(spriteNode);
        spriteNode.setPosition(this.ship.node.getPosition());
        Player.player.shadowRemainTime += CommonConfig.SHADOW_TIME;
    }

    protected scheduleBuff() {
        if (Player.player.shadowRemainTime <= 0) return;
        Player.player.shadowRemainTime -= 1;
        if (Player.player.shadowRemainTime % CommonConfig.SHADOW_TIME <= 0 && this.shipShadowList.length > 0) {
            this.planeShadowPool.put(this.shipShadowList.pop());
        }
        ObserverManager.sendNotification(GameEvent.DEDUCT_BUFF_TIME, ItemConfig.itemConfig.item_shadow.name);
    }

    //-----------------------------------------
    private KILL_ENEMY(enemySprite: EnemySprite, bDrop: boolean) {
        //自爆飞机将全屏其他飞机炸开
        if (enemySprite._enemyConfig.id == EnemyConfig.enemyConfig.enemyBomb.id) {
            this.cleanEnemy(CLEAN_ENEMY_TYPE.EXCEPT_SPECIAL_ENEMY, true);
        } else {
            if (bDrop) {
                this.doKillEnemyAward(enemySprite);
            }
        }
        this.playEnemyExplodeAnimation(enemySprite);
    }

    private PROTECT_EFFECT() {
        this.cleanEnemy(CLEAN_ENEMY_TYPE.ALL, true);
    }

    private GAME_OVER() {
        this.node.runAction(GameUtil.shakeBy(0.3,5,2))
        for (let key in this.shipShadowList) {
            this.shipShadowList[key].destroy();
        }
        this.shipShadowList.length = 0;
        this.playerDeadExplodeSprite.node.setPosition(this.ship.node.getPosition());
        this.playerDeadExplodeSprite.node.active = true;
        this.playerDeadExplodeSprite.play();
        this.playerDeadExplodeSprite.on(cc.Animation.EventType.FINISHED, function (xxoo, xx2) {
            this.playerDeadExplodeSprite.node.active = false;
            this.playerDeadExplodeSprite.off(cc.Animation.EventType.FINISHED);
        }, this)
        this.node.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function () {
                this.node.stopAllActions();
                if(Player.player.hasFinishGuide(GuideConfig.guideConfig.deadMinLevelFinish.name)){
                    SceneManager.instance().changeScene("resultScene");
                }
                GuideManager.instance().doTrigger(GuideTriggerEvent.GUIDE_DEAD);
            }, this)
        ));
    }

    private BULLET_HIT_ENEMY(pos: cc.Vec2) {
        var bulletHitEffectNode: cc.Node = this.createBulletHitEffect();
        bulletHitEffectNode.setPosition(pos);
        this.scheduleOnce(function () {
            this.bulletHitEffectPool.put(bulletHitEffectNode);
        }, 0.02);
    }

    private ITEM_COLLISION_PLAYER(itemConfig: any) {

    }

    private EAT_ITEM(itemConfigObj: any) {
        switch (itemConfigObj.name) {
            case ItemConfig.itemConfig.item_shadow.name:
                if (this.shipShadowList.length == 5) {
                    return;
                }
                this.setShadowStart();
                break;
        }
    }

    private SPURT_DURATION(bSpurt: boolean) {
        if (bSpurt) {
            this.unschedule(this.scheduleNormalEnemy);
            this.schedule(this.scheduleNormalEnemy, CommonConfig.ENEMY_SPURT_DELAY);
            this.createBombRain();
        } else {
            this.unschedule(this.scheduleNormalEnemy);
            this.schedule(this.scheduleNormalEnemy, CommonConfig.ENEMY_DELAY);
            this.cleanEnemy(CLEAN_ENEMY_TYPE.ALL, false);
        }
    }

    private FOCUS_ENEMY(enemyID:string){
        let enemy:EnemySprite = null;
        for(let key in this.node.children){
            enemy = this.node.children[key].getComponent(EnemySprite);
            if(enemy&&enemy._enemyConfig.id==enemyID){
                enemy.showGuide();
            }
        }
    }
    private FOCUS_ITEM(itemName:string){
        let item:ItemSprite = null;
        for(let key in this.node.children){
            item = this.node.children[key].getComponent(ItemSprite);
            if(item&&item._itemConfig.name==itemName){
                item.showGuide();
            }
        }
    }
}
