import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import {FLY_STATE} from "../../common/enum/FlyStateEnum";
import EnemySprite from "./EnemySprite";
import {Player} from "../../classes/Player";


const {ccclass, property} = cc._decorator;
@ccclass
export default class BossEnemySprite extends EnemySprite {
    update(dt){
        if(this.flyState==FLY_STATE.ENTER){
            if(this.node.y>CommonConfig.HEIGHT-this.node.width/3){
                this.node.y -= CommonConfig.ENEMY_SPEED/3*dt;
            }else{
                this.flyState = FLY_STATE.RUN;
                //一定时间后冲刺向玩家
                cc.tween(this.node)
                    .delay(CommonConfig.BIG_BOSS_STAYTIME)
                    .call(function(){
                            this.flyState = FLY_STATE.EXIT;
                        }, this)
                    .start()
            }
        }else if(this.flyState==FLY_STATE.RUN){

        }else if(this.flyState==FLY_STATE.EXIT){
            this.node.y -= CommonConfig.BIG_BOSS_SPEED*dt;
            if(this.node.y < -this.node.height) this.destroySprite();
        }
    }
    destroySprite(){
        Player.player._bossIng = false;
    }
    //死亡音效（子类重载）
    playDeathSound(){
        //音效
        GameUtil.playEffect(SoundConfig.boss_dead);
    }
}