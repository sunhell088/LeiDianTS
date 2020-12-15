import {PlaneConfig} from "../configs/PlaneConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {StoreItemConfig} from "../configs/StoreItemConfig";
import {CommonUtil} from "../common/CommonUtil";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";
import {ConfigUtil} from "../common/ConfigUtil";

export class Player {
    public static player: Player;

    //无敌模式
    public debugMode:boolean = true;

    //需要存盘的数据
    public data = {
        //飞机们的当前等级的经验
        exps: null,
        //飞机们的当前等级
        grades: null,
        //当前金币
        gold: 0,
        //飞行最远距离
        maxDistance: 0,
        //当前拥有的飞机（用掩码记录）
        planeStorage: 0,
        //当前使用的飞机
        currentPlaneID: 0,
        //已玩游戏次数
        playedCount: 0,
        //第一次的游戏时间（用于显示总在线游戏时间）
        bornTime: 0,
        //拥有的道具
        storeItemPackage: null
    };

    //当前拥有的炸弹数目
    public bomb:number = 1;
    //本局飞行距离
    public currentDistance:number = 0;
    //本局获得金币数
    public currentRewardGold:number = 0;
    //本局神秘祝福效果
    public randomItemID:string = "";

    public bgIndex: number = 0;

    //冲刺准备中
    public _spurtReadying:boolean = false;
    //冲刺中
    public _spurt:boolean = false;
    //使用炸弹中
    public _bomb:boolean = false;
    //boss战中
    public _bossIng:boolean = false;

    //开局冲刺持续时间（对面玩家最好距离一半）
    public _startSpurtDuration:number = 0;
    //死亡冲刺持续时间（死亡前跑的距离的1/10）
    public _deathSpurtDuration:number = 0;
    //接力飞机ID
    public _revivePlaneID:number = 0;
    //上一次飞行距离报数的阶段值
    public _preDistanceStage:number = 0;
    //是否已经显示过了刷新旧记录 图片
    public _alreadyShowUpdateRecord:boolean = false;
    //普通敌机随飞行距离增加的移动速度
    public _enemyAddSpeed:number = 0;
    //这轮普通飞机是否有自爆飞机
    public _createBombEnemy:boolean = false;
    //道具暴落列表(暴落的道具 做成一个序列，挨个暴)
    public _itemDropArr:any = null;

    //双击状态
    public _clicked:boolean = false;
    //已经死亡中（用于死亡后的一些处理，PS:死亡冲刺时，该状态也为true）
    public _death:boolean = false;
    //吸铁石中
    public _magnet:boolean = false;
    //双倍攻击中
    public _doublePower:boolean = false;
    //双倍火力中
    public _doubleFire:boolean = false;
    //护罩中
    public _protecting:boolean = false;
    //升级状态中
    public _levelUpIng:boolean = false;
    //切换战机登场中
    public _changePlaneIng:boolean = false;
    //停止发射子弹中
    public _stopBullet:boolean = true;

    //从本地读取玩家数据
    public loadData(){
        if(!localStorage.playerData)
        {
            this.data = JSON.parse(localStorage.playerData);
        }else{
            this.createPlayer();
        }
    }

    //每秒保存一次玩家数据
    public saveData(){
        JSON.stringify(this.data);
        localStorage.playerData = JSON.stringify(this.data);
    }

    //清存档
    public clearData(){
        localStorage.clear();
    }

    //第一次登录游戏，创建玩家对象
    public createPlayer() {
        let bornPlaneID = PlaneConfig.planeConfig[0].id;
        this.data.grades = {};
        this.data.grades[bornPlaneID] = this.data.grades[bornPlaneID] || 1;
        this.data.planeStorage = bornPlaneID;
        this.data.currentPlaneID = bornPlaneID;
        let date = new Date();
        this.data.bornTime = date.getTime();
        this.data.storeItemPackage = [];
    }

    //获得指定飞机的等级(不传参数则为当前出战飞机)
    public getBulletGrade(planeID?):number {
        if (planeID == undefined) planeID = this.data.currentPlaneID;
        this.data.grades[planeID] = this.data.grades[planeID] || 1;
        return this.data.grades[planeID];
    }

    //加金币
    public addGold(value){
        if(value<=0) return;
        this.data.gold += value;
    }

    //扣金币
    public deductGold(value){
        if(value<=0) return;
        this.data.gold -= value;
    }

    //增加本局金币数量
    public addCurrentRewardGold(value){
        if(value<=0) return;
        this.currentRewardGold += value;
        ObserverManager.sendNotification(GameEvent.SET_CURRENT_REWARD_GOLD, this.currentRewardGold)
    }
    //刷新最远飞行距离(返回是否创记录)
    public updateMaxDistance():boolean{
        if(this.currentDistance<=this.data.maxDistance) return false;
        this.data.maxDistance = this.currentDistance;
        return true;
    }
    //增加已玩游戏次数
    public addPlayedCount(){
        this.data.playedCount++;
    }
    //获得总在线游戏时间()
    public getTotalOnlineTime():number{
        var date = new Date();
        var onlineTime = date.getTime() - this.data.bornTime;
        return onlineTime;
    }
    //返回拥有的指定战机
    public getPlaneConfig(planeID):any{
        if(this.data.planeStorage&planeID){
            return ConfigUtil.getPlaneConfig(planeID);
        }
        return null;
    }
    //购买战机
    public buyPlane(planeID):boolean{
        let planeConfig = ConfigUtil.getPlaneConfig(planeID);
        if (!planeConfig) return false;
        if(this.data.gold<planeConfig.price) return false;
        this.deductGold(planeConfig.price);
        this.data.planeStorage += planeConfig.id;
        this.data.currentPlaneID = planeConfig.id;
        return true;
    }
    //设置当前战机
    public setCurrentPlane(planeID){
        if(!this.getPlaneConfig(planeID)) return;
        this.data.currentPlaneID = planeID;
    }
    //获得玩家身上指定商城道具
    public getStoreItem(itemID):any{
        for(var i=0; i<this.data.storeItemPackage.length; i++){
            if(this.data.storeItemPackage[i].itemID == itemID){
                return this.data.storeItemPackage[i];
            }
        }
        var storeItemConfig = ConfigUtil.getStoreItemConfig(itemID);
        if(storeItemConfig){
            var newItem = {itemID:itemID, count:0};
            this.data.storeItemPackage.push(newItem);
            return newItem;
        }
        return null;
    }
    //购买商城道具
    public buyStoreItem(itemID):boolean{
        var storeItemConfig = ConfigUtil.getStoreItemConfig(itemID);
        if(storeItemConfig==null) return false;
        if(this.data.gold<storeItemConfig.price) return false;
        this.deductGold(storeItemConfig.price);
        var storeItem = this.getStoreItem(itemID);
        storeItem.count++;
        //排序，用于执行时的顺序
        this.data.storeItemPackage.sort(
            function(a,b){
                var itemConfigA = ConfigUtil.getStoreItemConfig(a.itemID);
                var itemConfigB = ConfigUtil.getStoreItemConfig(b.itemID);
                return itemConfigA.sortValue<itemConfigB.sortValue;
            },1);
        return true;
    }
    //使用玩家的商城道具
    public useStoreItem(itemID):boolean{
        var storeItem = this.getStoreItem(itemID);
        if(storeItem==null||storeItem.count <= 0) return false;
        storeItem.count--;
        var storeItemConfig = ConfigUtil.getStoreItemConfig(itemID);
        ObserverManager.sendNotification(GameEvent.USE_STORE_ITEM, storeItemConfig);
        return true;
    }
    //花一定金币随机获得商城道具
    public randomItem():any{
        if(this.data.gold<CommonConfig.RANDOM_STOREITME_PRICE) return null;
        var randomItems = [];
        for(var p in StoreItemConfig.storeItemConfig) {
            //如果已经购买了怎不在随机里面
            if(this.getStoreItem(StoreItemConfig.storeItemConfig[p].id).count!=0) continue;
            //如果已经拥有全部飞机，跳过 切换战机 道具
            if(StoreItemConfig.storeItemConfig[p]==StoreItemConfig.storeItemConfig.changePlane){
                var haveAllPlane = true;
                for(var k in PlaneConfig){
                    if(!this.getPlaneConfig(PlaneConfig[k].id)){
                        haveAllPlane = false;
                        break;
                    }
                }
                if(haveAllPlane) continue;
            }
            randomItems.push(StoreItemConfig.storeItemConfig[p]);
        }
        if(randomItems.length==0) return null;
        var storeItemConfig = randomItems[CommonUtil.random(0, randomItems.length-1)];
        this.randomItemID = storeItemConfig.id;
        this.deductGold(CommonConfig.RANDOM_STOREITME_PRICE);
        return storeItemConfig;
    }
    //获得玩家子弹的威力
    public getBulletPower():number{
        var basePower = 1;
        var ratio = 1;
        if(this._doublePower) ratio = 2;
        return basePower*ratio;
    }
    //飞行距离对应的难度等级
    public getDistanceStage():number {
        return parseInt(""+this.currentDistance/CommonConfig.DISTANCE_STAGE_UNIT);
    }
    //每次战斗开始时，重置一次相关信息
    public resetFightData(){
        this.bomb = 1;
        this.currentDistance = 0;
        this.currentRewardGold = 0;
    }

}