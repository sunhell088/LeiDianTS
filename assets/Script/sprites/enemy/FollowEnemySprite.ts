import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import {FLY_STATE} from "../../common/enum/FlyStateEnum";
import EnemySprite from "./EnemySprite";
import {Player} from "../../classes/Player";
import ShipSprite from "../ShipSprite";
import FightScene from "../../scene/FightScene";


const {ccclass, property} = cc._decorator;
@ccclass
export default class FollowEnemySprite extends EnemySprite {
    //追踪时的x和y的速度
    followSpeed:cc.Vec2 = new cc.Vec2();
    //追踪时的音效（用于死亡时停止）
    followAudio:any = null;

    update(dt){
        let fightScene:FightScene = FightScene.getFightScene().getComponent(FightScene);
        if(Player.player._spurt){
            super.update(dt);
        }else{
            let speed = CommonConfig.FOLLOW_ENEMY_SPEED;
            if(this.flyState==FLY_STATE.ENTER){
                if(this.node.y > fightScene.node.height / 2 * 0.75){
                    this.node.y -= speed*dt;
                }else{
                    this.flyState = FLY_STATE.RUN;
                    //追踪时音效
                    this.followAudio = GameUtil.playEffect(SoundConfig.followEnemy_follow);
                    this.node.runAction(
                        cc.sequence(
                            cc.delayTime(1),
                            cc.blink(1,5),
                            cc.callFunc(function(){
                                let ship = fightScene.ship;
                                let playerPos:cc.Vec2 = new cc.Vec2(ship.node.x, ship.node.y);
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
                if(this.node.y < -fightScene.node.height/2-this.node.height) this.destroySprite();
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
        //音效
        GameUtil.playEffect(SoundConfig.followEnemy_dead);
    }
}