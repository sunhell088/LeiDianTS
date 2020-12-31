import {
    GuideResultPauseGame,
    GuideResultDialog,
    GuideResultFinishGuide
} from "../manager/guide/GuideResult";
import {GuideTriggerEvent} from "../common/GuideTriggerEvent";
import {EnemyConfig} from "./EnemyConfig";
import {
    GuideConditionEnemy,
    GuideConditionFinishGuide,
    GuideConditionNotFinishGuide
} from "../manager/guide/GuideCondition";
import {DialogConfig} from "./DialogConfig";

export class GuideConfig {

    public static guideConfig = {
        //第一次登场
        comeOnStage:{
            name:"comeOnStage",
            trigger:GuideTriggerEvent.GUIDE_COME_ON_STAGE,
            condition:[],
            result:[
                new GuideResultDialog("dialogComeOnStage01"),
                new GuideResultPauseGame()
            ]
        },
        //没完成每波最弱飞机指引后死亡
        deadNotMinLevelFinish:{
            name:"deadNotMinLevelFinish",
            trigger:GuideTriggerEvent.GUIDE_DEAD,
            condition:[new GuideConditionNotFinishGuide("minLevelEnemy")],
            result:[
                new GuideResultDialog("dialogDeadNotFinish01"),
                new GuideResultPauseGame()
            ]
        },
        //第一次遇到宝箱飞机
        blessEnemy:{
            name:"blessEnemy",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyBox.id)],
            result:[
                new GuideResultDialog("dialogBlessEnemy01"),
                new GuideResultPauseGame()
            ]
        },
        //第一次遇到追踪飞机
        followEnemy:{
            name:"followEnemy",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyFollow.id)],
            result:[
                new GuideResultDialog("dialogFollowEnemy01"),
                new GuideResultPauseGame()
            ]
        },
        //第一次遇到自爆飞机
        bombEnemy:{
            name:"bombEnemy",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyBomb.id)],
            result:[
                new GuideResultDialog("dialogBombEnemy01"),
                new GuideResultPauseGame()
            ]
        },
        //第一次遇到停留飞机
        stayEnemy:{
            name:"stayEnemy",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyStay1.id)],
            result:[
                new GuideResultDialog("dialogStayEnemy01"),
                new GuideResultPauseGame()
            ]
        },
        stayEnemy2:{
            name:"stayEnemy",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyStay2.id)],
            result:[
                new GuideResultDialog("dialogStayEnemy01"),
                new GuideResultPauseGame()
            ]
        },
        //遇到陨石
        rockAppear:{
            name:"rockAppear",
            trigger:GuideTriggerEvent.GUIDE_ROCK_APPEAR,
            condition:[],
            result:[
                new GuideResultDialog("dialogRock01"),
                new GuideResultPauseGame()
            ]
        },
        //第2次遇到宝箱飞机
        blessEnemy2:{
            name:"blessEnemy2",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[
                new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyBox.id),
                new GuideConditionFinishGuide("blessEnemy")
            ],
            result:[
                new GuideResultDialog("dialogBlessEnemy21"),
                new GuideResultPauseGame()
            ]
        },
        //第2次遇到追踪飞机
        followEnemy2:{
            name:"followEnemy2",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[
                new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyFollow.id),
                new GuideConditionFinishGuide("followEnemy")
            ],
            result:[
                new GuideResultDialog("dialogFollowEnemy21"),
                new GuideResultPauseGame()
            ]
        },
        //第2次遇到自爆飞机
        bombEnemy2:{
            name:"bombEnemy2",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[
                new GuideConditionEnemy(EnemyConfig.enemyConfig.enemyBomb.id),
                new GuideConditionFinishGuide("bombEnemy")
            ],
            result:[
                new GuideResultDialog("dialogBombEnemy21"),
                new GuideResultPauseGame()
            ]
        },
        //提示攻击每波最弱飞机
        minLevelEnemy0:{
            name:"minLevelEnemy0",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[
                new GuideConditionEnemy(EnemyConfig.enemyConfig.enemy1.id),
                new GuideConditionFinishGuide("stayEnemy")
            ],
            result:[
                new GuideResultDialog("dialogMinLevelEnemy0"),
                new GuideResultPauseGame()
            ]
        },
        //再次提示攻击每波最弱飞机
        minLevelEnemyOver2:{
            name:"minLevelEnemyOver2",
            trigger:GuideTriggerEvent.GUIDE_ENEMY_APPEAR,
            condition:[
                new GuideConditionEnemy(EnemyConfig.enemyConfig.enemy2.id)
            ],
            result:[
                new GuideResultDialog("dialogMinLevelEnemyOver"),
                new GuideResultPauseGame()
            ]
        },
        //完成第二次最弱飞机指引后死亡
        deadMinLevelFinish:{
            name:"deadMinLevelFinish",
            trigger:GuideTriggerEvent.GUIDE_DEAD,
            condition:[
                new GuideConditionFinishGuide("minLevelEnemyOver2")
            ],
            result:[
                new GuideResultDialog("finishGuideEnemy"),
                new GuideResultPauseGame()
            ]
        }
    };
}
