import {ItemConfig} from "../configs/ItemConfig";
import {GameUtil} from "./GameUtil";
import {SoundConfig} from "../configs/SoundConfig";
import {PlaneConfig} from "../configs/PlaneConfig";
import {CommonUtil} from "./CommonUtil";
import {Player} from "../classes/Player";
import {EnemyConfig} from "../configs/EnemyConfig";
import {CommonConfig} from "../configs/CommonConfig";
import {DifficultConfig} from "../configs/DifficultConfig";
import {LanguageConfig} from "../configs/LanguageConfig";

export class ConfigUtil {
    //根据飞行距离获取飞机库
    public static getEnemyConfigByStage(stageIndex){
        if(stageIndex<0)
            stageIndex = 0;
        if(stageIndex>=DifficultConfig.NormalEnemyForStage.length)
            stageIndex = DifficultConfig.NormalEnemyForStage.length-1;
        return DifficultConfig.NormalEnemyForStage[stageIndex];
    };

    //根据子弹威力获取敌机血量
    public static getEnemyHPByPower(enemyConfig):number{
        let enemyIndex = 0;
        for(let k in EnemyConfig){
            if(enemyConfig==EnemyConfig[k]){
                break;
            }
            enemyIndex++;
        }
        //默认0.1，这样非普通飞机的血量参数就是0.1
        let hp = 0.2;
        if(enemyIndex<EnemyConfig.totalHPArr.length){
            hp = EnemyConfig.totalHPArr[enemyIndex][Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)-1];
        }
        return hp*CommonConfig.BULLET_COUNT_PER;
    };

    //根据飞行距离获取陨石库
    public static getRockConfigByStage = function(){
        var diff1 = 0;
        var diff2 = 0;
        var diff3 = 0;
        var stageIndex = Player.player.getDistanceStage();
        if(stageIndex<3){
            diff1 = 10;
            diff2 = 0;
            diff3 = 0;
        }else if(stageIndex<6){
            diff1 = 7;
            diff2 = 3;
            diff3 = 0;
        }
        else if(stageIndex<10){
            diff1 = 4;
            diff2 = 6;
            diff3 = 0;
        }else{
            diff1 = 3;
            diff2 = 6;
            diff3 = 1;
        }
        diff2 += diff1;
        diff3 += diff2;
        var rockLib = null;
        var random = CommonUtil.random(0,diff3-1);
        if(random<diff1){
            rockLib = DifficultConfig.rockConfigForStage1;
        }else if(random<diff2){
            rockLib = DifficultConfig.rockConfigForStage2;
        }else{
            rockLib = DifficultConfig.rockConfigForStage3;
        }
        return rockLib[CommonUtil.random(0, rockLib.length-1)];
    };

    public static createSpecialEnemyDrop(enemySpriteSct){
        var dropArray = [];
        if(enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyBox){
            dropArray.push(ItemConfig.itemConfig.item_green);
            dropArray.push(ItemConfig.itemConfig.item_green);
            dropArray.push(ConfigUtil.getSpecialDropItem());
        }else {
            let item = ConfigUtil.getSpecialDropItem();
            dropArray.push(item);
        }
        return dropArray;
    };

    //获得功能性暴落物
    public static getSpecialDropItem():any{
        var itemConfig = null;
        var random = parseInt(""+CommonUtil.random(1,100));
        for(var i=0; i<DifficultConfig.SPECIAL_DROP_ODDS.length; i++){
            var oddsItem = DifficultConfig.SPECIAL_DROP_ODDS[i];
            if(random>=oddsItem.min&&random<=oddsItem.max){
                itemConfig = oddsItem.itemConfig;
                break;
            }
        }
        return itemConfig;
    };

    public static transformToPixel(width, height, formationConfig):any{
        for(var p=0;p<formationConfig.length;p++){
            var property = formationConfig[p];
            if(!(property instanceof Array)) continue;
            var pixelArray = [];
            for(var i=0; i<property.length; i++){
                var tag = property[i];
                var x = 0, y = 0;
                if(tag>=0&&tag<=4){
                    y = height;
                }else if(tag>=5&&tag<=9){
                    y = height/2;
                }else if(tag>=10&&tag<=14){
                    y = 0;
                }else if(tag>=15&&tag<=19){
                    y = -height/2;
                }else if(tag>=20&&tag<=24){
                    y = -height;
                }

                var widthUnit = CommonConfig.WIDTH/10;
                if(tag%5 == 0){
                    x = widthUnit*1;
                }else if(tag%5 == 1){
                    x = widthUnit*3;
                }else if(tag%5 == 2){
                    x = widthUnit*5;
                }else if(tag%5 == 3){
                    x = widthUnit*7;
                }else if(tag%5 == 4){
                    x = widthUnit*9;
                }
                x -= CommonConfig.WIDTH/2;

                pixelArray.push(new cc.Vec2(x, y));
            }
            formationConfig[p] = pixelArray;
        }
        return formationConfig;
    };

    //吃道具特效
    public static eatItemEffect (itemConfig){
        if(itemConfig.gold){
            //音效
            if(itemConfig == ItemConfig.itemConfig.item_coin){
                GameUtil.playSound(SoundConfig.get_coin);
            }else{
                GameUtil.playSound(SoundConfig.get_bs);
            }
        }else{
            //音效
            GameUtil.playSound(SoundConfig.get_item);
        }
    };

    public static getPlaneConfig(planeID){
        for(let p in PlaneConfig.planeConfig){
            if(PlaneConfig.planeConfig[p].id == planeID){
                return PlaneConfig.planeConfig[p];
            }
        }
        return null;
    };

    //获得指定等级升到下一级需要的经验（如：1级升2级所需要的经验，参数为1）
    public static getExpByLevel(level):number{
        if(level<0 || level>=PlaneConfig.levelExp.length) return -1;
        return PlaneConfig.levelExp[level];
    };

    //获得当前子弹商城的随机购买库
    public static getRandomStoreBullet(planeID):number {
        let randomGrade:number = 0;
        let maxGrade:number = Player.player.getBulletMaxGrade(planeID);
        if(maxGrade<5){
            randomGrade = 1;
        }else if(maxGrade<7){
            randomGrade = CommonUtil.random(1,3);
        }else {
            randomGrade = CommonUtil.random(1,maxGrade-3);
        }
        return randomGrade;
    }

    public static getStoreSoldBulletPrice(grade:number):number {
        return grade*100;
    }

    //根据key 获取文字  如：getLanguage("{0} + {1} = {2}", 5, 7, 12)
    public static getLanguage(txtKey:string, ...parameters):string {
        let format = LanguageConfig.languageConfig[txtKey];
        for (let i = 0, l = parameters.length; i < l; i++) {
            format = format.replace(new RegExp("\\{" + i + "\\}", "g"), parameters[i]);
        }
        return format;
    }
}