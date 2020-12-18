import {PlaneConfig} from "../configs/PlaneConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";
import {ConfigUtil} from "../common/ConfigUtil";

export class Player {
    public static player: Player;

    //无敌模式
    public debugMode: boolean = false;

    //需要存盘的数据
    public data = {
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
        //飞机们的商城子弹(-1:表示未开启，0：表示开启，但没子弹，>0：表示子弹等级)
        storeBulletMap: null,
        //当前开启子弹格子数量
        storeBulletGridCount: 4
    };

    //本局飞行距离
    public currentDistance: number = 0;
    //本局获得金币数
    public currentRewardGold: number = 0;

    public bgIndex: number = 0;


    //上一次飞行距离报数的阶段值
    public _preDistanceStage: number = 0;
    //普通敌机随飞行距离增加的移动速度
    public _enemyAddSpeed: number = 0;
    //冲刺准备中
    public _spurtReadying: boolean = false;
    //冲刺中
    public _spurt: boolean = false;
    //使用炸弹中
    public _bomb: boolean = false;
    //boss战中
    public _bossIng: boolean = false;
    //已经死亡中
    public _death: boolean = false;
    //吸铁石中
    public _magnet: boolean = false;
    //双倍火力中
    public _doubleFire: boolean = false;
    //护罩中
    public _protecting: boolean = false;
    //停止发射子弹中
    public _stopBullet: boolean = true;

    //当前子弹商店的随机子弹等级
    public storeSoldBulletGradeMap: {} = {};

    //从本地读取玩家数据
    public loadData() {
        if (!localStorage.playerData) {
            this.data = JSON.parse(localStorage.playerData);
        } else {
            this.createPlayer();
        }
    }

    //每秒保存一次玩家数据
    public saveData() {
        JSON.stringify(this.data);
        localStorage.playerData = JSON.stringify(this.data);
    }

    //清存档
    public clearData() {
        localStorage.clear();
    }

    //第一次登录游戏，创建玩家对象
    public createPlayer() {
        let bornPlaneID = PlaneConfig.planeConfig[0].id;
        this.data.planeStorage = bornPlaneID;
        this.data.currentPlaneID = bornPlaneID;
        let date = new Date();
        this.data.bornTime = date.getTime();
        this.data.storeBulletMap = {};
        for (let key in PlaneConfig.planeConfig) {
            let storeBulletList: number[] = [];
            storeBulletList.push(1);
            for (let i = 1; i < 16; i++) {
                if (i < this.data.storeBulletGridCount) {
                    storeBulletList.push(0);
                } else {
                    storeBulletList.push(-1);
                }

            }
            this.data.storeBulletMap[PlaneConfig.planeConfig[key].id] = storeBulletList;
            this.storeSoldBulletGradeMap[PlaneConfig.planeConfig[key].id] = ConfigUtil.getRandomStoreBullet(PlaneConfig.planeConfig[key].id);
        }
    }

    //获得指定飞机最高等级
    public getBulletMaxGrade(planeID: number): number {
        let storeBulletList = this.data.storeBulletMap[planeID];
        let maxGrade: number = 0;
        for (let key in storeBulletList) {
            if (storeBulletList[key] > maxGrade) {
                maxGrade = storeBulletList[key];
            }
        }
        return maxGrade;
    }

    public getStoreBulletEmptyIndex(planeID): number {
        let storeBulletList: number[] = this.data.storeBulletMap[planeID];
        for (let i = 0; i < storeBulletList.length; i++) {
            if (storeBulletList[i] == 0) {
                return i;
            }
        }
        return -1;
    }

    public buyBullet(planeID) {
        let emptyIndex: number = this.getStoreBulletEmptyIndex(planeID);
        if (emptyIndex == -1) {
            window.alert("没有空位了，可以先合成相同的子弹");
        } else {
            let bulletGrade: number = this.storeSoldBulletGradeMap[planeID]
            this.data.gold -= bulletGrade;
            this.data.storeBulletMap[planeID][emptyIndex] = bulletGrade;
            Player.player.storeSoldBulletGradeMap[planeID] = ConfigUtil.getRandomStoreBullet(planeID);
            ObserverManager.sendNotification(GameEvent.UPDATE_STORE_BULLET);
        }
    }

    public combineStoreBullet(planeID: number, sourceIndex: number, targetIndex: number) {
        let storeBulletList: number[] = this.data.storeBulletMap[planeID];
        let sourceValue: number = storeBulletList[sourceIndex];
        let targetValue: number = storeBulletList[targetIndex];
        if (sourceValue != targetValue) return false;
        storeBulletList[sourceIndex] = 0;
        storeBulletList[targetIndex] = targetValue + 1;
        if (storeBulletList[targetIndex] >= Player.player.data.storeBulletGridCount) {
            //开启新格子
            this.data.storeBulletMap[planeID][Player.player.data.storeBulletGridCount] = 0;
            Player.player.data.storeBulletGridCount += 1;

        }
        ObserverManager.sendNotification(GameEvent.UPDATE_STORE_BULLET);
    }

    //加金币
    public addGold(value) {
        if (value <= 0) return;
        this.data.gold += value;
    }

    //扣金币
    public deductGold(value) {
        if (value <= 0) return;
        this.data.gold -= value;
    }

    //增加本局金币数量
    public addCurrentRewardGold(value) {
        if (value <= 0) return;
        this.currentRewardGold += value;
        ObserverManager.sendNotification(GameEvent.SET_CURRENT_REWARD_GOLD, this.currentRewardGold)
    }

    //刷新最远飞行距离(返回是否创记录)
    public updateMaxDistance(): boolean {
        if (this.currentDistance <= this.data.maxDistance) return false;
        this.data.maxDistance = this.currentDistance;
        return true;
    }

    //增加已玩游戏次数
    public addPlayedCount() {
        this.data.playedCount++;
    }

    //获得总在线游戏时间()
    public getTotalOnlineTime(): number {
        var date = new Date();
        var onlineTime = date.getTime() - this.data.bornTime;
        return onlineTime;
    }

    //返回拥有的指定战机
    public getPlaneConfig(planeID): any {
        if (this.data.planeStorage & planeID) {
            return ConfigUtil.getPlaneConfig(planeID);
        }
        return null;
    }

    //购买战机
    public buyPlane(planeID): boolean {
        let planeConfig = ConfigUtil.getPlaneConfig(planeID);
        if (!planeConfig) return false;
        if (this.data.gold < planeConfig.price) return false;
        this.deductGold(planeConfig.price);
        this.data.planeStorage += planeConfig.id;
        this.data.currentPlaneID = planeConfig.id;
        return true;
    }

    //设置当前战机
    public setCurrentPlane(planeID) {
        if (!this.getPlaneConfig(planeID)) return;
        this.data.currentPlaneID = planeID;
    }

    //获得玩家子弹的威力
    public getBulletPower(): number {
        var basePower = 1;
        var ratio = 1;
        return basePower * ratio;
    }

    //飞行距离对应的难度等级
    public getDistanceStage(): number {
        return parseInt("" + this.currentDistance / CommonConfig.DISTANCE_STAGE_UNIT);
    }

    //每次战斗开始时，重置一次相关信息
    public resetFightData() {
        this._stopBullet = true;
        this.currentDistance = 0;
        this.currentRewardGold = 0;
    }

}