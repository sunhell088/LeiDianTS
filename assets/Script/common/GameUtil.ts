import {CommonConfig} from "../configs/CommonConfig";
import {CommonUtil} from "./CommonUtil";

export class GameUtil {
    public static bgMove(dt, bg1, bg2) {
        const speed = CommonConfig.BG_SPEED;
        bg1.y -= speed*dt;
        bg2.y -= speed*dt;
        if(bg1.y <= -bg1.height){
            bg1.y = bg2.y + bg2.height;
        }

        if(bg2.y <= -bg2.height){
            bg2.y = bg1.y + bg1.height;
        }
    }

    public static getEnemyExp (){
        // for (var i = 0; i < VVV.PRESET_COUNT.ENEMY_EXP; i++){
        //     var enemyExp = VVV.CONTAINER.ENMEY_EXP[i];
        //     if(!enemyExp.visible){
        //         enemyExp.visible = true;
        //         return enemyExp;
        //     }
        // }
        return null;
    }

    //获得吃暴落物品的特效
    public static getEatEffectPreset(){
        // for(var i=0; i<VVV.CONTAINER.EAT_ITEM_EFFECT.length; i++){
        //     var eatEffect = VVV.CONTAINER.EAT_ITEM_EFFECT[i];
        //     if(!eatEffect.visible){
        //         eatEffect.visible = true;
        //         return eatEffect;
        //     }
        // }
        return null;
    };
    //获得敌机的血条预设
    public static getEnemyBloodBarPreset(){
        // for(var i=0; i<VVV.CONTAINER.ENMEY_BLOODBAR.length; i++){
        //     var bloodBar = VVV.CONTAINER.ENMEY_BLOODBAR[i];
        //     if(!bloodBar.visible){
        //         bloodBar.visible = true;
        //         return bloodBar;
        //     }
        // }
        // cc.warn("getEnemyBloodBarPreset not enough ");
        return null;
    };

    //获得炸弹时的小攻击动画预设
    public static getBombEffect(id){
        // var bombEffect = null;
        // var bombs = VVV.CONTAINER.BOMBS[id];
        // for(var i=0; i<bombs.length; i++){
        //     bombEffect = bombs[i];
        //     if(!bombEffect.visible){
        //         bombEffect.visible = true;
        //         return bombEffect;
        //     }
        // }
        // cc.warn("getBombEffect not enough " + id);
        return null;
    };
    //随机屏幕的宽（减去传入对象的宽一半）
    public static randomWidth(sprite:cc.Node){
        var min = sprite.width/2;
        var max = CommonConfig.WIDTH - sprite.width/2;
        return CommonUtil.random(min, max);
    };
    //随机屏幕的高（减去传入对象的高一半）
    public static randomHeight(sprite:cc.Node){
        var min = sprite.height/2;
        var max = CommonConfig.HEIGHT - sprite.height/2;
        return CommonUtil.random(min, max);
    };

    //获得一个执行后隐藏sender的事件
    public static getHideSelfCallFun():cc.Tween {
        return cc.tween().hide();
    }

    public static shakeBy(duration, shakeCount, strength):cc.Tween {
        duration = duration/2/shakeCount;
        return cc.tween().repeat(shakeCount,
            cc.tween().to(duration, {angle: strength}).to(duration, {angle: -strength}));
    };

    //播放背景音乐
    public static  playMusic(file){
        return;
        if(!navigator.onLine) return;
        if (CommonConfig.MUSIC){
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(file, true);
        }
    };
    //播放音效
    public static playEffect(file){
        return;
        if(!navigator.onLine) return;
        if (CommonConfig.EFFECT){
            return cc.audioEngine.playEffect(file, false);
        }
        return null;
    };
}