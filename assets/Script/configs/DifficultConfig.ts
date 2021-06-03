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

    //爆金币和钻石的概率-----------增加或删除时，注意修改几率--------------
    public static SPECIAL_DROP_ODDS = [
        {min:0,max:20, itemConfig:ItemConfig.itemConfig.item_xts},
        {min:21,max:40, itemConfig:ItemConfig.itemConfig.item_bomb},
        {min:41,max:60, itemConfig:ItemConfig.itemConfig.item_shadow},
        {min:61,max:80, itemConfig:ItemConfig.itemConfig.item_double},
        {min:81,max:100, itemConfig:ItemConfig.itemConfig.item_protect}
    ];

    //初级陨石库
    public static rockConfigForStage1 = [
        [[1]],
        [[2]],
        [[3]],
        [[4]],

        [[0,5]],
        [[1,4]],
        [[2,3]],

        [[0,1,2]],
        [[3,4,5]],
        [[1,2,3]],
        [[2,3,4]],

        [[0],[1],[2]],
        [[5],[4],[3]],
        [[2],[1],[0]],
        [[3],[4],[5]],

        [[2],[0,1]],
        [[3],[4,5]],

        [[2,3],[1],[0]],
        [[2,3],[4],[5]],

        [["1"]],
        [["3"]],

        [[0,"5"]],
        [["0",5]]
    ];
    //中级陨石库
    public static rockConfigForStage2 = [
        [[0,1,2,3]],
        [[2,3,4,5]],
        [[1,2,3,4]],

        [[3],[0,1,2]],
        [[2],[3,4,5]],

        [["0","5"]],

        [[0,1,"2"]],
        [["3",4,5]],

        [["0"],["1"],["2"]],

        [["5"],[0,1,2]],
        [["0"],[3,4,5]]
    ];
    //高级陨石库
    public static rockConfigForStage3 = [
        [[1],[2],[3],[4]],

        [[4],[3],[2],[1]],

        [[1,2,3,4]],
        [[1,2,3,4]],

        // [["5"],[0,1,2,3]],
        // [["0"],[2,3,4,5]]
    ];

    public static stayEnemyArr = [EnemyConfig.enemyConfig.enemyStay1, EnemyConfig.enemyConfig.enemyStay2];

}