import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import EnemySprite from "./EnemySprite";
import {CommonUtil} from "../../common/CommonUtil";
import {FLY_STATE} from "../../common/GameEnum";


const {ccclass, property} = cc._decorator;
@ccclass
export default class FlexEnemySprite extends EnemySprite {
    getStartPosition(self:FlexEnemySprite) {
        var randomX:number = CommonUtil.random(-CommonConfig.WIDTH/2+self.node.width / 2, CommonConfig.WIDTH/2 - self.node.width / 2);
        var randomY:number = CommonUtil.random(0, CommonConfig.HEIGHT/2);
        return new cc.Vec2(randomX, randomY);
    }

    //重载update
    update(dt) {
        if (this.flyState == FLY_STATE.ENTER) {
            this.flyState = FLY_STATE.RUN;
            var array = [];
            array.push(new cc.Vec2(this.node.x, this.node.y));
            for (var i = 0; i < 10; i++) {
                var x = CommonUtil.random(-CommonConfig.WIDTH/2, CommonConfig.WIDTH/2);
                var y = CommonUtil.random(0, CommonConfig.HEIGHT/2);
                array.push(new cc.Vec2(x, y));
            }
            var action1 = cc.catmullRomTo(5, array);
            this.node.runAction(cc.sequence(
                cc.fadeIn(0.5),
                cc.blink(0.7, 5),
                cc.delayTime(0.5),
                action1,
                cc.delayTime(0.5),
                cc.fadeOut(0.5),
                cc.callFunc(function () {
                    this.destroySprite()
                }, this)
            ));
        } else if (this.flyState == FLY_STATE.RUN) {

        } else if (this.flyState == FLY_STATE.EXIT) {

        }
    }

    //死亡音效（子类重载）
    playDeathSound() {
        //音效
        GameUtil.playSound(SoundConfig.box_dead);
    }
}