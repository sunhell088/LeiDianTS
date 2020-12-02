import {EnemyConfig} from "./EnemyConfig";
import {Player} from "../classes/Player";
import {CommonConfig} from "./CommonConfig";
import {ItemConfig} from "./ItemConfig";
import {CommonUtil} from "../common/CommonUtil";

export class DifficultConfig {
    public static NormalEnemyForStage:any[] = [
        EnemyConfig.enemyConfig.enemy0,//500
        EnemyConfig.enemyConfig.enemy0,//1000
        EnemyConfig.enemyConfig.enemy1,//1500
        EnemyConfig.enemyConfig.enemy1,//2000
        EnemyConfig.enemyConfig.enemy2,//2500
        EnemyConfig.enemyConfig.enemy2,//3000
        EnemyConfig.enemyConfig.enemy3,//3500
        EnemyConfig.enemyConfig.enemy3,//4000
        EnemyConfig.enemyConfig.enemy4,//4500
        EnemyConfig.enemyConfig.enemy4,//5000
        EnemyConfig.enemyConfig.enemy5,//5500
        EnemyConfig.enemyConfig.enemy5,//6000
        EnemyConfig.enemyConfig.enemy6,//6500
        EnemyConfig.enemyConfig.enemy6,//7000
        EnemyConfig.enemyConfig.enemy7,//7500
        EnemyConfig.enemyConfig.enemy7,//8000
        EnemyConfig.enemyConfig.enemy8,//8500
        EnemyConfig.enemyConfig.enemy8,//9000
        EnemyConfig.enemyConfig.enemy9,//9500
        EnemyConfig.enemyConfig.enemy9//10000
    ];
    //根据飞行距离获取飞机库
    public static getEnemyConfigByStage(stageIndex){
        if(stageIndex<0)
            stageIndex = 0;
        if(stageIndex>=DifficultConfig.NormalEnemyForStage.length)
            stageIndex = DifficultConfig.NormalEnemyForStage.length-1;
        return DifficultConfig.NormalEnemyForStage[stageIndex];
    };

    //根据子弹威力获取敌机血量
    public static getEnemyHPByPower(enemyConfig):number{
        let totalHPArr = [
            [0.3,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
            [0.4,0.4,0.3,0.3,0.3,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
            [0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0],
            [0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2],
            [1.0,1.0,1.0,1.0,0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.2,0.2,0.2,0.2,0.2],
            [1.2,1.2,1.2,1.2,1.0,1.0,1.0,1.0,0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.2],
            [1.4,1.4,1.4,1.4,1.2,1.2,1.2,1.2,1.0,1.0,1.0,1.0,0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3,0.3],
            [1.6,1.6,1.6,1.6,1.4,1.4,1.4,1.4,1.2,1.2,1.2,1.2,1.0,1.0,1.0,1.0,0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3,0.3],
            [1.8,1.8,1.8,1.8,1.6,1.6,1.6,1.6,1.4,1.4,1.4,1.4,1.2,1.2,1.2,1.2,1.0,1.0,1.0,1.0,0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.3],
            [2.0,2.0,2.0,2.0,1.8,1.8,1.8,1.8,1.6,1.6,1.6,1.6,1.4,1.4,1.4,1.4,1.2,1.2,1.2,1.2,1.0,1.0,1.0,1.0,0.8,0.8,0.8,0.6,0.6,0.5,0.5,0.5,0.5,0.4,0.4]
        ];
        let enemyIndex = 0;
        for(let k in EnemyConfig){
            if(enemyConfig==EnemyConfig[k]){
                break;
            }
            enemyIndex++;
        }
        //默认0.1，这样非普通飞机的血量参数就是0.1
        let hp = 0.2;
        if(enemyIndex<totalHPArr.length){
            hp = totalHPArr[enemyIndex][Player.player.getGrade()-1];
        }
        return hp*CommonConfig.BULLET_COUNT_PER;
    };

    //爆金币和钻石的概率
    public static GOLD_DROP_ODDS = [
        {min:1,max:95, itemConfig:ItemConfig.itemConfig.item_coin},
        {min:96,max:99, itemConfig:ItemConfig.itemConfig.item_red},
        {min:100,max:100, itemConfig:ItemConfig.itemConfig.item_green}
    ];

    //获得暴落物
    public static getDropItemArray (amount){
        var dropArray = [];
        for(var x=0;x<amount;x++){
            var random = parseInt(""+CommonUtil.random(1,100));
            for(var i=0; i<DifficultConfig.GOLD_DROP_ODDS.length; i++){
                var oddsItem = DifficultConfig.GOLD_DROP_ODDS[i];
                if(random>=oddsItem.min&&random<=oddsItem.max){
                    dropArray.push(oddsItem.itemConfig);
                    break;
                }
            }
        }
        //最后再乱序
        dropArray.sort(function(){return Math.random()>0.5?-1:1;});
        return dropArray;
    };

    //初级陨石库
    public static rockConfigForStage1 = [
        [[1]],
        [[2]],
        [[3]],
        [[4]],

        [[0,5]],
        //[[1,4]],
        [[2,3]],

        [[0,1,2]],
        [[3,4,5]],
        //[[1,2,3]],
        //[[2,3,4]],

        [[0],[1],[2]],
        [[5],[4],[3]],
        //[[2],[1],[0]],
        //[[3],[4],[5]],

        //[[2],[0,1]],
        //[[3],[4,5]],

        //[[2,3],[1],[0]],
        //[[2,3],[4],[5]],

        [["1"]],
        [["3"]]

        //[[0,"5"]],
        //[["0",5]]
    ];
    //中级陨石库
    public static rockConfigForStage2 = [
        [[0,1,2,3]],
        [[2,3,4,5]],
        //[[1,2,3,4]],

        //[[4],[3],[0,1,2]],
        //[[1],[2],[3,4,5]],

        //[[0],[1],[2],[3],[4]],
        //[[5],[4],[3],[2],[1]],

        [["0","5"]],

        [[0,1,"2"]],
        [["3",4,5]],

        [["0"],["1"],["2"]],

        //[["5"],[0,1,2]],
        //[["0"],[3,4,5]]
    ];
    //高级陨石库
    public static rockConfigForStage3 = [
        [[0,1,2,3,4]],
        [[1,2,3,4,5]]

        //[["5"],[0,1,2,3]],
        //[["0"],[2,3,4,5]]
    ];


    //根据飞行距离获取陨石库
    public static getRockConfigByStage = function(){
        var diff1 = 0;
        var diff2 = 0;
        var diff3 = 0;
        var stageIndex = Player.player.getDistanceStage();
        if(stageIndex<3){
            diff1 = 10;
            diff2 = 0;
            diff3 = 0;
        }else if(stageIndex<6){
            diff1 = 7;
            diff2 = 3;
            diff3 = 0;
        }
        else if(stageIndex<10){
            diff1 = 4;
            diff2 = 6;
            diff3 = 0;
        }else{
            diff1 = 3;
            diff2 = 6;
            diff3 = 1;
        }
        diff2 += diff1;
        diff3 += diff2;
        var rockLib = null;
        var random = CommonUtil.random(0,diff3-1);
        if(random<diff1){
            rockLib = DifficultConfig.rockConfigForStage1;
        }else if(random<diff2){
            rockLib = DifficultConfig.rockConfigForStage2;
        }else{
            rockLib = DifficultConfig.rockConfigForStage3;
        }
        return rockLib[CommonUtil.random(0, rockLib.length-1)];
    };

    //福利飞机数组
    public static blessEnemys = [EnemyConfig.enemyConfig.enemyBox, EnemyConfig.enemyConfig.enemyBomb];
    //停留飞机数组
    public static stayEnemys = [EnemyConfig.enemyConfig.enemyStay1, EnemyConfig.enemyConfig.enemyStay2, EnemyConfig.enemyConfig.enemyFollow];
}