import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import {FLY_STATE} from "../../common/enum/FlyStateEnum";
import EnemySprite from "./EnemySprite";


const {ccclass, property} = cc._decorator;
@ccclass
export default class StayEnemySprite extends EnemySprite {
    update(dt){
        var speed = CommonConfig.SMALL_BOSS_SPEED;
        if(this.flyState==FLY_STATE.ENTER){
            if(this.node.y>CommonConfig.HEIGHT*0.75){
                this.node.y -= speed*dt;
            }else{
                this.flyState = FLY_STATE.RUN;
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(CommonConfig.SMALL_BOSS_STAYTIME),
                        cc.callFunc(function(){
                                this.flyState = FLY_STATE.EXIT;
                            },
                            this
                        )
                    )
                );
            }
        }else if(this.flyState==FLY_STATE.RUN){

        }else if(this.flyState==FLY_STATE.EXIT){
            this.node.y -= speed*dt;
            if(this.node.y < -this.node.height) this.destroySprite();
        }
    }
    //死亡音效（子类重载）
    playDeathSound(){
        //音效
        GameUtil.playEffect(SoundConfig.boss_dead);
    }
}