import EnemySprite from "./EnemySprite";
import {Player} from "../../classes/Player";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import {FLY_STATE} from "../../common/GameEnum";
import CanvasNode from "../../scene/CanvasNode";
import {GuideConfig} from "../../configs/GuideConfig";

const {ccclass, property} = cc._decorator;
@ccclass
export default class FollowEnemySprite extends EnemySprite {
    //追踪时的x和y的速度
    followSpeed:cc.Vec2 = new cc.Vec2();
    //追踪时的音效（用于死亡时停止）
    followAudio:any = null;
    //闪烁时不受伤
    bBlink:boolean = true;

    hurt(bulletPower, bDrop) {
        if(!Player.player.checkGuideFinish(GuideConfig.guideConfig.followEnemy.name)
            ||!Player.player.checkGuideFinish(GuideConfig.guideConfig.followEnemy2.name)){
            if(!this.bBlink){
                super.hurt(bulletPower, bDrop);
            }
        }else {
            super.hurt(bulletPower, bDrop);
        }
    }
    destroySprite() {
        super.destroySprite();
        this.bBlink = true;
    }

    update(dt){
        let fightNodeSize:cc.Size = CanvasNode.getCanvasNode().getFightNodeSize();
        if(Player.player._spurt){
            super.update(dt);
        }else{
            let speed = CommonConfig.FOLLOW_ENEMY_SPEED;
            if(this.flyState==FLY_STATE.ENTER){
                if(this.node.y > fightNodeSize.height / 2 * 0.75){
                    this.node.y -= speed*dt;
                }else{
                    this.flyState = FLY_STATE.RUN;
                    //追踪时音效
                    this.followAudio = GameUtil.playSound(SoundConfig.followEnemy_follow);
                    this.node.runAction(
                        cc.sequence(
                            cc.fadeIn(0.5),
                            cc.blink(0.7, 5),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                this.bBlink = false;
                                let playerPos:cc.Vec2 =  CanvasNode.getCanvasNode().getShipNodePos();
                                let x2 = Math.pow(Math.abs(this.node.x-playerPos.x),2);
                                let y2 = Math.pow(Math.abs(this.node.y-playerPos.y),2);
                                let time = Math.sqrt(x2+y2)/speed;
                                this.followSpeed.x = (this.node.x-playerPos.x)/time;
                                this.followSpeed.y = (this.node.y-playerPos.y)/time;
                                this.flyState = FLY_STATE.EXIT;
                            },this)
                        )
                    );
                }
            }else if(this.flyState==FLY_STATE.RUN){

            }else if(this.flyState==FLY_STATE.EXIT){
                this.node.x -= this.followSpeed.x*dt;
                this.node.y -= this.followSpeed.y*dt;
                if(this.node.y < -fightNodeSize.height/2-this.node.height) this.destroySprite();
            }
        }
    }
    //死亡
    death(bDrop) {
        super.death(bDrop);
        cc.audioEngine.stopEffect(this.followAudio);
    }
    //死亡音效（子类重载）
    playDeathSound(){
        Player.player.guideFinish(GuideConfig.guideConfig.followEnemy.name);
        if(Player.player.checkGuideFinish(GuideConfig.guideConfig.followEnemy.name)){
            Player.player.guideFinish(GuideConfig.guideConfig.followEnemy2.name);
        }
        //音效
        GameUtil.playSound(SoundConfig.followEnemy_dead);
    }
}