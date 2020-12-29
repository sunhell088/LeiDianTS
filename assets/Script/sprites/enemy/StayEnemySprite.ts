import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import EnemySprite from "./EnemySprite";
import FightScene from "../../scene/FightScene";
import {FLY_STATE} from "../../common/GameEnum";
import CanvasNode from "../../scene/CanvasNode";
import {EnemyConfig} from "../../configs/EnemyConfig";
import {Player} from "../../classes/Player";


const {ccclass, property} = cc._decorator;
@ccclass
export default class StayEnemySprite extends EnemySprite {
    update(dt) {
        let fightNodeSize:cc.Size = CanvasNode.getCanvasNode().getFightNodeSize();
        var speed = CommonConfig.SMALL_BOSS_SPEED;
        if (this.flyState == FLY_STATE.ENTER) {
            if (this.node.y > fightNodeSize.height / 2 * 0.75) {
                this.node.y -= speed * dt;
            } else {
                this.flyState = FLY_STATE.RUN;
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(this._enemyConfig.id==EnemyConfig.enemyConfig.enemyBomb.id?0:CommonConfig.SMALL_BOSS_STAYTIME),
                        cc.callFunc(function () {
                                this.flyState = FLY_STATE.EXIT;
                            },
                            this
                        )
                    )
                );
            }
        } else if (this.flyState == FLY_STATE.RUN) {

        } else if (this.flyState == FLY_STATE.EXIT) {
            this.node.y -= speed * dt;
            if (this.node.y < -fightNodeSize.height / 2 - this.node.height) this.destroySprite();
        }
    }

    //死亡音效（子类重载）
    playDeathSound() {
        //音效
        GameUtil.playSound(SoundConfig.boss_dead);
    }
}