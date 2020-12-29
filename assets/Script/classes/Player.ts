import {PlaneConfig} from "../configs/PlaneConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";
import {ConfigUtil} from "../common/ConfigUtil";
import {BUY_BULLET_STATE} from "../common/GameEnum";

export class Player {
    public static player: Player;

    //无敌模式
    public debugMode: boolean = true;

    //需要存盘的数据
    public data = {
        //当前金币
        gold: this.debugMode ? 88888 : 0,
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
        //飞机们的商城子弹(大于0：表示子弹等级)
        storeBulletMap: null,
        //当前子弹商店的随机子弹等级
        storeSoldBulletGradeMap: {},
        //已经完成的新手教程
        finishGuideMap: {}
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

    //吸铁石剩余时间
    public magnetRemainTime: number = 0;
    //护盾剩余时间
    public protectRemainTime: number = 0;
    //二条剩余时间
    public doubleFireRemainTime: number = 0;
    //影子剩余时间
    public shadowRemainTime: number = 0;
    //当前子弹最高等级
    public bulletLevelMaxMap: {} = {};
    //自动合成剩余时间
    public autoCombineBulletTime: number = 0;
    //炸弹数量
    public bombCount: number = 0;

    //从本地读取玩家数据
    public loadData() {
        if (localStorage.playerData) {
            this.data = JSON.parse(localStorage.playerData);
            for (let key in PlaneConfig.planeConfig) {
                let planeID: number = PlaneConfig.planeConfig[key].id;
                this.bulletLevelMaxMap[planeID] = this.calculateBulletMaxGrade(planeID);
            }
        } else {
            this.createPlayer();
        }
    }

    //每秒保存一次玩家数据
    public saveData() {
        let dataStr = JSON.stringify(Player.player.data);
        localStorage.playerData = dataStr;
    }

    //清存档
    public clearData() {
        localStorage.clear();
        this.data = null;
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
            for (let i = 1; i < 9; i++) {
                storeBulletList.push(0);

            }
            this.data.storeBulletMap[PlaneConfig.planeConfig[key].id] = storeBulletList;
            this.data.storeSoldBulletGradeMap[PlaneConfig.planeConfig[key].id] = 1;
            this.bulletLevelMaxMap[PlaneConfig.planeConfig[key].id] = 1;
        }
    }

    //判断指定新手引导是否完成
    public checkGuideFinish(guideName:string) {
        let bFinish:boolean = (this.data.finishGuideMap[guideName]!=null);
        return bFinish;
    }
    //设置新手引导为完成状态
    public guideFinish(guideName:string) {
        this.data.finishGuideMap[guideName]=true;
    }
    public getBulletMaxGrade(planeID: number): number {
        return this.bulletLevelMaxMap[planeID];
    }

    //获得指定飞机子弹的最高等级
    public calculateBulletMaxGrade(planeID: number): number {
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

    public buyBullet(planeID): BUY_BULLET_STATE {
        let emptyIndex: number = this.getStoreBulletEmptyIndex(planeID);
        if (emptyIndex == -1) {
            //自动合成中，就不飘提示
            if (Player.player.autoCombineBulletTime <= 0) {
                let notice: string = ConfigUtil.getLanguage("buyBulletNoGrid");
                ObserverManager.sendNotification(GameEvent.FLY_NOTICE, notice);
            }
            return BUY_BULLET_STATE.NO_GRID;
        } else {
            let bulletGrade: number = this.data.storeSoldBulletGradeMap[planeID];
            let bulletPrice: number = ConfigUtil.getStoreSoldBulletPrice(bulletGrade);
            if (this.data.gold < bulletPrice) {
                let notice: string = ConfigUtil.getLanguage("noMoney", bulletPrice - this.data.gold);
                ObserverManager.sendNotification(GameEvent.FLY_NOTICE, notice);
                return BUY_BULLET_STATE.NO_MONEY;
            }
            this.deductGold(bulletPrice)
            this.data.storeBulletMap[planeID][emptyIndex] = bulletGrade;
            let randomGrade: number = ConfigUtil.getRandomStoreBullet(planeID);
            //如果只有一个格子了，并且随机到了所有都不相同的等级
            let storeBulletList: number[] = this.data.storeBulletMap[planeID];
            let emptyCount: number = 0;
            for (let i = 0; i < storeBulletList.length; i++) {
                if (storeBulletList[i] == 0) emptyCount++;
            }
            if (emptyCount == 1) {
                while (true) {
                    let bSame: boolean = this.checkSameBulletGrid(planeID, randomGrade);
                    if (bSame) {
                        break;
                    } else {
                        randomGrade = ConfigUtil.getRandomStoreBullet(planeID);
                    }
                }
            }
            Player.player.data.storeSoldBulletGradeMap[planeID] = randomGrade;
            //新购买不可能购买到高于当前等级的，所以为false
            ObserverManager.sendNotification(GameEvent.UPDATE_STORE_BULLET, false, -1, emptyIndex, false);
        }
        return BUY_BULLET_STATE.OK;
    }

    public combineStoreBullet(planeID: number, sourceIndex: number, targetIndex: number, bAuto: boolean) {
        let oldLevel: number = this.calculateBulletMaxGrade(planeID);
        let storeBulletList: number[] = this.data.storeBulletMap[planeID];
        let sourceValue: number = storeBulletList[sourceIndex];
        let targetValue: number = storeBulletList[targetIndex];
        if (sourceValue != targetValue) return false;
        if (sourceIndex >= storeBulletList.length) return false;
        if (targetIndex >= storeBulletList.length) return false;
        storeBulletList[sourceIndex] = 0;
        storeBulletList[targetIndex] = targetValue + 1;
        let newLevel: number = this.calculateBulletMaxGrade(planeID);
        this.bulletLevelMaxMap[planeID] = newLevel;
        ObserverManager.sendNotification(GameEvent.UPDATE_STORE_BULLET, newLevel > oldLevel, sourceIndex, targetIndex, bAuto);
    }

    //检查新产生的子弹在里面是否已经没有重复的了
    public checkSameBulletGrid(planeID: number, newBulletGrade: number): boolean {
        let storeBulletList: number[] = this.data.storeBulletMap[planeID];
        let bHave: boolean = false;
        for (let i = 0; i < storeBulletList.length; i++) {
            if (storeBulletList[i] <= 0) continue;
            if (storeBulletList[i] == newBulletGrade) {
                bHave = true;
                break;
            }
        }
        return bHave;
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
        ObserverManager.sendNotification(GameEvent.UPDATE_STORE_GOLD);
    }

    //增加本局金币数量
    public addCurrentRewardGold(value) {
        if (value <= 0) return;
        this.currentRewardGold += value;
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

    //设置当前战机
    public setCurrentPlane(planeID) {
        if (!this.getPlaneConfig(planeID)) return;
        this.data.currentPlaneID = planeID;
    }

    //获得玩家子弹的威力
    public getBulletPower(): number {
        return this.getBulletMaxGrade(this.data.currentPlaneID);
    }

    //飞行距离对应的难度等级(500米一个等级)
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