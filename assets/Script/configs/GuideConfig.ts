import {GuideTriggerComeOnStage, GuideTriggerEnemyAppear, GuideTriggerItemDrop} from "../manager/guide/GuideTrigger";
import {GuideFocusEnemy, GuidePauseGame, GuideResultDialog} from "../manager/guide/GuideResult";
import {EnemyConfig} from "./EnemyConfig";
import {DialogConfig} from "./DialogConfig";

export class GuideConfig {

    public static guideConfig = {
        comeOnStage:{
            name:"comeOnStage",
            trigger:[new GuideTriggerComeOnStage()],
            condition:[],
            result:[new GuideResultDialog("comeOnStage01"), new GuidePauseGame()]
        },
        blessEnemy:{
            name:"blessEnemy",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyBox.id)],
            condition:[],
            result:[new GuideResultDialog("blessEnemy01"), new GuidePauseGame(), new GuideFocusEnemy()]
        },
        followEnemy:{
            name:"followEnemy",
            trigger:[new GuideTriggerEnemyAppear(EnemyConfig.enemyConfig.enemyFollow.id)],
            condition:[],
            result:[new GuideResultDialog("followEnemy01"), new GuidePauseGame(), new GuideFocusEnemy()]
        }


    };
}
