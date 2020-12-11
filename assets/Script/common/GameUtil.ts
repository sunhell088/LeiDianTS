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

    //随机屏幕的宽（减去传入对象的宽一半）
    public static randomWidth(sprite:cc.Node){
        var min = -CommonConfig.WIDTH/2 + sprite.width/2;
        var max = CommonConfig.WIDTH/2 - sprite.width/2;
        return CommonUtil.random(min, max);
    };
    //随机屏幕的高（减去传入对象的高一半）
    public static randomHeight(sprite:cc.Node){
        var min = -CommonConfig.HEIGHT/2+ sprite.height/2;
        var max = CommonConfig.HEIGHT/2 - sprite.height/2;
        return CommonUtil.random(min, max);
    };

    //获得一个执行后隐藏sender的事件
    public static getHideSelfCallFun(obj:cc.Node):cc.ActionInstant {
        return cc.callFunc(function(){ this.active = false}, obj);
    }

    public static shakeBy(duration, shakeCount, strength):cc.ActionInterval {
        return new cc.ActionInterval();
        // duration = duration/2/shakeCount;
        // return cc.tween().repeat(shakeCount,
        //     cc.tween().to(duration, {angle: strength}).to(duration, {angle: -strength}));
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
    public static playSound(file){
        return;
        if(!navigator.onLine) return;
        if (CommonConfig.EFFECT){
            return cc.audioEngine.playEffect(file, false);
        }
        return null;
    };


}