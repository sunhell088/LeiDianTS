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
import FollowEnemySprite from "../sprites/enemy/FollowEnemySprite";
import ItemSprite from "../sprites/ItemSprite";
import {IMediator} from "../framework/mvc/IMediator";
import {CLEAN_TYPE} from "../common/GameEnum";
import {ConfigUtil} from "../common/ConfigUtil";
import {GameEvent} from "../common/GameEvent";
import {ObserverManager} from "../framework/observe/ObserverManager";
import FightUI from "./ui/FightUI";


const {ccclass, property} = cc._decorator;
@ccclass
export default class FightScene extends cc.Component implements IMediator {

    @property(cc.Sprite)
    background0: cc.Sprite = null;
    @property(cc.Sprite)
    background1: cc.Sprite = null;
    @property(cc.Sprite)
    bombEffect:cc.Sprite = null;
    @property(cc.Sprite)
    darkSprite:cc.Sprite = null;
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
    enemyExplodePrefab:cc.Prefab = null;
    @property(cc.Prefab)
    enemyExplode2Prefab:cc.Prefab = null;
    @property(cc.Sprite)
    playerDeadExplodeSprite:cc.Sprite = null;

    private bulletPool: cc.NodePool = new cc.NodePool();
    private enemyPool: cc.NodePool = new cc.NodePool();
    private enemyFlexPool: cc.NodePool = new cc.NodePool();
    private enemyBossPool: cc.NodePool = new cc.NodePool();
    private enemyFollowPool: cc.NodePool = new cc.NodePool();
    private enemyStayPool: cc.NodePool = new cc.NodePool();
    private rockLinePool: cc.NodePool = new cc.NodePool();
    private rockPool: cc.NodePool = new cc.NodePool();
    private itemPool: cc.NodePool = new cc.NodePool();
    private enemyExplodePool: cc.NodePool = new cc.NodePool();

    getCommands(): string[] {
        return [GameEvent.KILL_ENEMY, GameEvent.CHANGE_PLANE, GameEvent.PROTECT_EFFECT, GameEvent.USE_BOMB, GameEvent.GAME_OVER
            ,GameEvent.UP_GRADE];
    }

    protected onLoad(): void {
        this.init();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.schedule(this.shoot, CommonConfig.BULLET_DELAY);
        this.schedule(this.scheduleNormalEnemy, CommonConfig.ENEMY_DELAY);
        // this.schedule(this.scheduleRockGroup, CommonConfig.ROCK_CONFIG_DELAY);
        // this.schedule(this.scheduleBlessEnemy, CommonConfig.BLESS_PLANE_DELAY);
        // this.schedule(this.scheduleStayEnemy, CommonConfig.STAY_ENEMY_DELAY);
    }

    protected onDisable():void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.unschedule(this.shoot);
        this.unschedule(this.scheduleNormalEnemy);
        // this.unschedule(this.scheduleRockGroup);
        // this.unschedule(this.scheduleBlessEnemy);
        // this.unschedule(this.scheduleStayEnemy);
    }

    protected update(dt) {
        this.moveBackground(dt);
    }

    private init(){
        ObserverManager.registerObserverFun(this);
        //切换背景音乐
        GameUtil.playMusic(SoundConfig.fightMusic_mp3);
        this.background0.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.background1.spriteFrame = this.bgSptArr[Player.player.bgIndex];
        this.initPlayer();
    }
    private moveBackground(dt) {
        if (Player.player._changePlaneIng) return;
        if (Player.player._death) return;
        GameUtil.bgMove(dt, this.background0.node, this.background1.node);

        //记录飞行距离
        var showSpeed = Player.player._spurt ? CommonConfig.DISTANCE_SPURT_SPEED : CommonConfig.DISTANCE_SPEED;
        Player.player.currentDistance += showSpeed * dt;
        ObserverManager.sendNotification(GameEvent.MOVE_BG, Math.round(Player.player.currentDistance));
        // FightUI.getFightUI().MOVE_BG(Math.round(Player.player.currentDistance));
        //每500M报数 TODO
        if (Player.player.getDistanceStage() > Player.player._preDistanceStage) {
            Player.player._preDistanceStage = Player.player.getDistanceStage();
            //普通飞机速度变快
            this.addEnemySpeed(Player.player._preDistanceStage);
            //创建BOSS
            this.createBoos(Player.player._preDistanceStage);
        }
    }
    //定时创建普通飞机
    private scheduleNormalEnemy() {
        //升级状态中 不创建
        if (Player.player._levelUpIng) return;
        var formation = FormationConfig.formationConfig[CommonUtil.random(0, FormationConfig.formationConfig.length - 1)];
        var dropItemArray = ConfigUtil.getDropItemArray(formation.length);
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
            var enemyConfig = ConfigUtil.getEnemyConfigByStage(Player.player.getDistanceStage());
            var enemy: EnemySprite = null;
            if (bombEnemyIndex == i) {
                enemyConfig = EnemyConfig.enemyConfig.enemyBomb;
                Player.player._createBombEnemy = false;
            } else if (worstEnemyIndex == i || worstEnemyIndex2 == i) {
                enemyConfig = ConfigUtil.getEnemyConfigByStage(0);
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
                enemy.setDynamicData(ConfigUtil.getEnemyHPByPower(enemy._enemyConfig), 1, dropItem);
            }
        }
    }
    //定时创建特殊飞机
    private scheduleBlessEnemy() {
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
            enemy.setDynamicData(hp, 1, ConfigUtil.createSpecialEnemyDrop(enemy));
        }
    }
    //定时创建特殊飞机
    private scheduleStayEnemy() {
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
        enemy.setDynamicData(hp, 1, ConfigUtil.createSpecialEnemyDrop(enemy));
    }
    //定时创建陨石掉落组
    private scheduleRockGroup() {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._levelUpIng || Player.player._bossIng) return;
        var rockList = ConfigUtil.getRockConfigByStage();
        var actionList = [];
        for (var i = 0; i < rockList.length; i++) {
            var createRockAction = cc.callFunc(
                function (list) {
                    for (var k = 0; k < list.length; k++) {
                        var bornIndex = list[k];
                        var bFollow = false;
                        if (typeof (bornIndex) == "string") bFollow = true;
                        this.createRock(bFollow, bornIndex);
                    }
                    //在同一批次的陨石给音效
                    GameUtil.playSound(SoundConfig.alert_big);
                },this,{list: rockList[i]}
            );
            actionList.push(cc.delayTime(CommonConfig.ROCK_DELAY));
            actionList.push(createRockAction);
        }
        this.node.runAction(cc.sequence(actionList));
    }
    //根据飞行距离创建BOSS
    private createBoos(distanceStage){
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
        boss.setDynamicData(hp, 1, ConfigUtil.createSpecialEnemyDrop(boss));
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
    private shoot() {
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
    //根据player信息初始化显示对象
    private initPlayer() {
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        this.ship.shipSprite.spriteFrame = this.shipAtlas.getSpriteFrame(planeConfig.fightTextureName);
        this.ship.node.setPosition(0, 0);
        // planeConfig.planeFunction(this.ship); TODO

        //重置和战斗相关的数据
        Player.player.resetFightData();

        this.storeItemEffect("start");

        //登场
        this.ship.comeOnStage();
    }
    //商城道具效果(开局时)
    storeItemEffect(state):boolean {
        let triggerSuccess = false;
        //随机道具
        let item = ConfigUtil.getStoreItemConfig(Player.player.randomItemID);
        if(item&&item.trigger==state){
            // item.itemFunction(); TODO
            Player.player.randomItemID = "0";
            triggerSuccess = true;
        }
        //购买的道具
        for(var i=0; i<Player.player.data.storeItemPackage.length; i++){
            var itemObj = Player.player.data.storeItemPackage[i];
            item = ConfigUtil.getStoreItemConfig(itemObj.itemID);
            if(item.trigger==state){
                if(Player.player.useStoreItem(itemObj.itemID)){
                    triggerSuccess = true;
                }
            }
        }
        return triggerSuccess;
    }
    //创建陨石
    private createRockLineSprite(): RockLineSprite {
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
    private createRockSprite(): RockSprite {
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

    //清屏（清除陨石，所有敌机、子弹、陨石爆炸）
    private cleanEnemy(cleanType:CLEAN_TYPE=CLEAN_TYPE.ALL, bDrop:boolean=true){
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
                    }else {
                        if(cleanType==CLEAN_TYPE.ENEMY_WITHOUT_SPECIAL){
                            enemy.hurt(-1, bDrop)
                        }
                    }
                }
            }
        }
    }
    //创建炸弹效果
    private createBomb(){
        //音效
        GameUtil.playSound(SoundConfig.useBomb);
        Player.player._bomb = true;
        this.cleanEnemy(CLEAN_TYPE.ALL, true);
        var actionArray = [];
        //屏幕变暗
        this.darkSprite.node.active = true;
        //创建光圈并且变大
        this.bombEffect.node.active = true;
        this.bombEffect.node.scale = 1
        this.bombEffect.node.setPosition(this.ship.node.x, this.ship.node.y);
        this.bombEffect.node.runAction(cc.scaleBy(0.6,30));
        //创建炸弹效果
        var createBombAction = cc.callFunc(
            function(){ //TODO
                // var bomb:cc.Node = GameUtil.getBombEffect(Player.player.data.currentPlaneID);
                // bomb.setPosition(GameUtil.randomWidth(bomb), -bomb.height);
                // bomb.runAction(cc.sequence(
                //     cc.moveBy(CommonConfig.ROCK_BOMB_SPEED, new cc.Vec2(0, CommonConfig.HEIGHT/2*1.5)),
                //     cc.callFunc(function(sender){sender.active = false})
                // ));
            }
        );
        for(var i=0; i<CommonConfig.PRESET_COUNT_BOMB; i++){
            actionArray.push(createBombAction);
            actionArray.push(cc.delayTime(0.2));
        }
        var overFunc = cc.callFunc(
            function(){
                this.dark.node.active = false;
                this.bombEffect.node.active = false;
                Player.player._bomb = false;
            },{dark:this.darkSprite, bombEffect:this.bombEffect}
        );
        actionArray.push(overFunc);
        this.bombEffect.node.runAction(cc.sequence(actionArray));
    }
    //杀敌奖励
    private doKillEnemyAward(enemySprite:EnemySprite){
        var exp = enemySprite._expValue;
        //冲刺等阶段 经验降低
        if(Player.player._spurt||Player.player._bomb||Player.player._spurtReadying){
            exp = enemySprite._expValue/3;
            if(Player.player._startSpurtDuration||Player.player._deathSpurtDuration){
                exp = 0;
            }
        }
        //获得经验
        Player.player.addExp(exp);

        //掉落物品
        for(var i=0;i<enemySprite._dropItems.length;i++){
            var item:ItemSprite = this.createItemSprite(enemySprite._dropItems[i]);
            item.setSpriteFrame();
            item.node.x = enemySprite.node.x;
            item.node.y = enemySprite.node.y;
            //多个暴落物的话，散开
            if(i!=0){
                item.node.x += CommonUtil.random(-100,100);
                item.node.y += CommonUtil.random(0,100);
            }
            item.drop();
        }
    }

    private onTouchBegan(event) {
        if(Player.player._clicked){
            ObserverManager.sendNotification(GameEvent.DOUBLE_CLICK);
        }else{
            Player.player._clicked = true;
            this.scheduleOnce(function(){ Player.player._clicked = false; }, 0.25);
        }
        return true
    }

    private onTouchMoved(event) {
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

    //创建子弹复用对象
    private createBullet(): cc.Node {
        let spriteNode:cc.Node = null;
        if (this.bulletPool.size() > 0) {
            spriteNode = this.bulletPool.get();
        } else {
            spriteNode = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(spriteNode);
        let bulletSprite = spriteNode.getComponent('BulletSprite');
        bulletSprite.initSprite(spriteNode, this.bulletAtlas, this.bulletPool);
        let planeConfig = ConfigUtil.getPlaneConfig(Player.player.data.currentPlaneID);
        bulletSprite.setBulletSpriteFrame(planeConfig.bulletType, Player.player.getGrade(Player.player.data.currentPlaneID));
        return spriteNode;
    }
    //创建敌机复用对象
    private createEnemy(enemyConfig: any): EnemySprite {
        let spriteNode: cc.Node = null;
        let enemySprite: EnemySprite = null;;
        let enemyPrefab:cc.Prefab = this.enemyPrefab;
        let classNameStr:string = CommonUtil.getQualifiedClassName(enemyConfig.classType);
        let pool:cc.NodePool = this.enemyPool;
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
    //创建爆落复用对象
    private createItemSprite(itemConfig:any): ItemSprite {
        let spriteNode = null;
        if (this.itemPool.size() > 0) {
            spriteNode = this.itemPool.get();
        } else {
            spriteNode = cc.instantiate(this.itemPrefab);
        }
        this.node.addChild(spriteNode);
        let itemSprite: ItemSprite = spriteNode.getComponent('ItemSprite');
        itemSprite.initSprite(spriteNode,this.itemAtlas, this.itemPool, itemConfig);
        return itemSprite;
    }
    //创建陨石复用对象
    private createRock(bFollow, bornIndex) {
        //指定炸弹中、冲刺中、冲刺准备中、升级状态中 不创建
        if (Player.player._bomb || Player.player._spurt || Player.player._spurtReadying || Player.player._levelUpIng) return;
        var line: RockLineSprite = this.createRockLineSprite();
        line._bFollow = bFollow;
        var bornX = -CommonConfig.WIDTH/2 + line.node.width / 2 + bornIndex * line.node.width;
        line.node.setPosition(bornX, this.node.height / 2);
        var lineAction = cc.callFunc(function () {
                //创建陨石的动作
                var createRockAction = cc.callFunc(function (sender) {
                        var rock: RockSprite = this.createRockSprite();
                        if (rock) {
                            rock.node.setPosition(sender.x, sender.y + rock.node.height);
                        }
                        sender.active = false;
                        //警告消失，陨石落下的时候，给音效
                        GameUtil.playSound(SoundConfig.meteor);
                    },this
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
    //创建敌机爆炸复用对象
    private playEnemyExplodeAnimation(enemySprite:EnemySprite) {
        let explodeNode:cc.Node = null;
        if (this.enemyExplodePool.size() > 0) {
            explodeNode = this.enemyExplodePool.get();
        } else {
            explodeNode = cc.instantiate(this.enemyExplodePrefab);
        }
        this.node.addChild(explodeNode);

        explodeNode.setPosition(enemySprite.node.getPosition())
        let effectAnimation:cc.Animation = explodeNode.getComponent(cc.Animation);
        effectAnimation.on(cc.Animation.EventType.FINISHED, function () {
            this.enemyExplodePool.put(explodeNode);
        }, this);
        effectAnimation.play();
    }

    //-----------------------------------------
    private KILL_ENEMY(enemySprite:EnemySprite, bDrop:boolean){
        //自爆飞机将全屏其他飞机炸开
        if(enemySprite._enemyConfig==EnemyConfig.enemyConfig.enemyBomb){
            this.cleanEnemy(CLEAN_TYPE.ENEMY_WITHOUT_SPECIAL, true);
        }else {
            if(bDrop){
                this.doKillEnemyAward(enemySprite);
            }
        }
        this.playEnemyExplodeAnimation(enemySprite);
    }

    private CHANGE_PLANE(){
        this.createBomb();
    }

    private PROTECT_EFFECT(){
        this.cleanEnemy(CLEAN_TYPE.ALL, true);
    }

    private USE_BOMB(){
        if(Player.player._bomb||Player.player._spurt||Player.player._spurtReadying||Player.player._levelUpIng) return;
        if(!Player.player.useBomb()){
            this.node.runAction(GameUtil.shakeBy(0.2,5,5));
            return;
        }
        this.createBomb();
    }

    private GAME_OVER(){
        this.node.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function () {
                cc.audioEngine.stopAllEffects();
                this.node.stopAllActions();
                cc.director.loadScene('loginScene');
            }, this)
        ));
    }

    private UP_GRADE(){
        this.cleanEnemy(CLEAN_TYPE.ALL, true);
    }
}
