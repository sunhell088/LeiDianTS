import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import EnemySprite from "./EnemySprite";
import {Player} from "../../classes/Player";
import CanvasNode from "../../scene/CanvasNode";
import {FLY_STATE} from "../../common/GameEnum";


const {ccclass, property} = cc._decorator;
@ccclass
export default class BossEnemySprite extends EnemySprite {
    update(dt){
        let fightNodeSize:cc.Size = CanvasNode.getCanvasNode().getFightNodeSize();
        if(this.flyState==FLY_STATE.ENTER){
            if (this.node.y > fightNodeSize.height / 2 * 0.75) {
                this.node.y -= CommonConfig.SMALL_BOSS_SPEED*dt;
            }else{
                this.flyState = FLY_STATE.RUN;
                //一定时间后冲刺向玩家
                this.node.runAction(cc.sequence(cc.delayTime(CommonConfig.BIG_BOSS_STAYTIME),
                    cc.callFunc(function () {
                        this.flyState = FLY_STATE.EXIT;
                    },this)
                    ));
            }
        }else if(this.flyState==FLY_STATE.RUN){

        }else if(this.flyState==FLY_STATE.EXIT){
            this.node.y -= CommonConfig.BIG_BOSS_SPEED*dt;
            if(this.node.y < -fightNodeSize.height/2-this.node.height) this.destroySprite();
        }
    }
    destroySprite(){
        Player.player._bossIng = false;
    }
    //死亡音效（子类重载）
    playDeathSound(){
        //音效
        GameUtil.playSound(SoundConfig.boss_dead);
    }
}