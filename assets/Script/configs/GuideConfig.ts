import {GuideTriggerComeOnStage, GuideTriggerEnemyAppear, GuideTriggerItemDrop} from "../manager/guide/GuideTrigger";
import {GuideFocusEnemy, GuidePauseGame, GuideResultDialog} from "../manager/guide/GuideResult";
import {EnemyConfig} from "./EnemyConfig";
import {GuideConditionFinishID} from "../manager/guide/GuideCondition";

export class GuideConfig {

    public static guideConfig = {
        comeOnStage:{
            name:"comeOnStage",
            trigger:[new GuideTriggerComeOnStage()],
            result:[new GuideResultDialog("dialogComeOnStage01"), new GuidePauseGame()]
        },
        blessEnemy:{
            name:"blessEnemy",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyBox.id)],
            result:[new GuideResultDialog("dialogBlessEnemy01"), new GuidePauseGame(), new GuideFocusEnemy()]
        },
        followEnemy:{
            name:"followEnemy",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyFollow.id)],
            result:[new GuideResultDialog("dialogFollowEnemy01"), new GuidePauseGame(), new GuideFocusEnemy()]
        },
        bombEnemy:{
            name:"bombEnemy",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyBomb.id)],
            result:[new GuideResultDialog("dialogBombEnemy01"), new GuidePauseGame(), new GuideFocusEnemy()]
        },
        blessEnemy2:{
            name:"blessEnemy2",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyBox.id)],
            condition:[new GuideConditionFinishID("blessEnemy")],
            result:[new GuideResultDialog("dialogBlessEnemy21"), new GuidePauseGame(), new GuideFocusEnemy()]
        },
        followEnemy2:{
            name:"followEnemy2",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyFollow.id)],
            condition:[new GuideConditionFinishID("followEnemy2")],
            result:[new GuideResultDialog("dialogFollowEnemy21"), new GuidePauseGame(), new GuideFocusEnemy()]
        },
        bombEnemy2:{
            name:"bombEnemy2",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyBomb.id)],
            condition:[new GuideConditionFinishID("bombEnemy2")],
            result:[new GuideResultDialog("dialogBombEnemy21"), new GuidePauseGame(), new GuideFocusEnemy()]
        }


    };
}
