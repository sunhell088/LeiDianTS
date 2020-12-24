import {CommonConfig} from "../configs/CommonConfig";
import {CommonUtil} from "./CommonUtil";
import {Player} from "../classes/Player";
import ShakeActionInterval from "./SkakeActionInterval";
import AudioClip = cc.AudioClip;
import {SoundConfig} from "../configs/SoundConfig";

export class GameUtil {
    //同时播放通一个音效（实际是很短的时间内播放音效），那么只播放一次
    private static ignoreSameSound:{} = {};
    private static resumeMusicFileName:string = null;

    public static bgMove(dt, bg1, bg2) {
        let speed = Player.player._spurt?CommonConfig.BG_SPURT_SPEED:CommonConfig.BG_SPEED;
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
        return new ShakeActionInterval(duration, shakeCount, strength, strength);
    };

    public static resumeMusic(){
        if (CommonConfig.MUSIC){
            cc.resources.load(GameUtil.resumeMusicFileName, cc.AudioClip,function (err, audioClip:AudioClip) {
                cc.audioEngine.playMusic(audioClip, true);
            });
        }
    }
    //播放背景音乐
    public static playMusic(fileName){
        if(fileName!=SoundConfig.shadowStart){
            GameUtil.resumeMusicFileName = fileName;
        }
        if (CommonConfig.MUSIC){
            cc.resources.load(fileName, cc.AudioClip,function (err, audioClip:AudioClip) {
                cc.audioEngine.playMusic(audioClip, true);
            });
        }
    };
    //播放音效
    public static playSound(fileUrl){
        if (CommonConfig.EFFECT){
            let lastTime:number = GameUtil.ignoreSameSound[fileUrl];
            let nowTime:number = (new Date()).getTime();
            if (lastTime && nowTime - lastTime < 50) {
                return;
            }
            this.ignoreSameSound[fileUrl] = nowTime;
            cc.resources.load(fileUrl, cc.AudioClip, function (err, audioClip:AudioClip) {
                cc.audioEngine.playEffect(audioClip, false);
            });
        }
    };

}