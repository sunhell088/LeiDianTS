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
import game = cc.game;

export class ConfigUtil {
    //根据飞行距离获取飞机库
    public static getEnemyConfigByStage(stageIndex){
        if(stageIndex<0)
            stageIndex = 0;
        if(stageIndex>=DifficultConfig.NormalEnemyForStage.length)
            stageIndex = DifficultConfig.NormalEnemyForStage.length-1;
        return DifficultConfig.NormalEnemyForStage[stageIndex];
    };

    //根据飞行距离获取陨石库
    public static getRockConfigByStage = function(){
        var diff1 = 0;
        var diff2 = 0;
        var diff3 = 0;
        var stageIndex = Player.player.getDistanceStage();
        if(stageIndex<3){
            diff1 = 7;
            diff2 = 3;
            diff3 = 0;
        }else if(stageIndex<6){
            diff1 = 5;
            diff2 = 3;
            diff3 = 2;
        }
        else if(stageIndex<10){
            diff1 = 3;
            diff2 = 3;
            diff3 = 4;
        }else{
            diff1 = 1;
            diff2 = 2;
            diff3 = 7;
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
        //宝箱飞机爆 影子
        if(enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyBox){
            dropArray.push(ConfigUtil.getSpecialDropItem());
        }
        //追踪飞机爆 影子
        else if(enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyFollow){
            for(let i=0;i<5;i++){
                dropArray.push(ItemConfig.itemConfig.item_red);
            }
        }
        //停留飞机爆 冲刺
        else if(enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyStay1
        ||enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyStay2){
            for(let i=0;i<5;i++){
                dropArray.push(ItemConfig.itemConfig.item_green);
            }
        }
        //boss飞机爆 全部
        else if(enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyBoss1
            ||enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyBoss1
            || enemySpriteSct._enemyConfig == EnemyConfig.enemyConfig.enemyBoss1){
            dropArray.push(ItemConfig.itemConfig.item_xts);
            dropArray.push(ItemConfig.itemConfig.item_protect);
            dropArray.push(ItemConfig.itemConfig.item_shadow);
            dropArray.push(ItemConfig.itemConfig.item_double);
            for (let i=0;i<10;i++){
                dropArray.push(ItemConfig.itemConfig.item_green);
            }
        }else {
            dropArray.push(ItemConfig.itemConfig.item_coin);
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
        if(itemConfig==null){
            console.error("getSpecialDropItem null")
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
        let maxGrade:number = Player.player.getBulletMaxGrade(planeID);
        let randomGrade:number = CommonUtil.random(maxGrade-3,maxGrade);
        if(randomGrade<1) randomGrade = 1;
        return randomGrade;
    }

    public static getStoreSoldBulletPrice(grade:number):number {
        let priceRatio:number = 500;
        // if(grade<10){
        //     priceRatio = 10;
        // }else if(grade<10){
        //     priceRatio = 100;
        // }else if(grade<20){
        //     priceRatio = 200;
        // }
        return grade*priceRatio;
    }

    //根据key 获取文字  如：getLanguage("{0} + {1} = {2}", 5, 7, 12)
    public static getLanguage(txtKey:string, ...parameters):string {
        let format = LanguageConfig.languageConfig[txtKey];
        for (let i = 0, l = parameters.length; i < l; i++) {
            format = format.replace(new RegExp("\\{" + i + "\\}", "g"), parameters[i]);
        }
        return format;
    }

    //根据飞机类型生成血量
    public static getEnemyHP(enemyConfig):number{
        let hp:number = 0;
        switch (enemyConfig.id) {
            case EnemyConfig.enemyConfig.enemy0.id:
                hp = 10;
                break;
            case EnemyConfig.enemyConfig.enemy1.id:
                hp = 20;
                break;
            case EnemyConfig.enemyConfig.enemy2.id:
                hp = 30;
                break;
            case EnemyConfig.enemyConfig.enemy3.id:
                hp = 40;
                break;
            case EnemyConfig.enemyConfig.enemy4.id:
                hp = 50;
                break;
            case EnemyConfig.enemyConfig.enemy5.id:
                hp = 100;
                break;
            case EnemyConfig.enemyConfig.enemy6.id:
                hp = 150;
                break;
            case EnemyConfig.enemyConfig.enemy7.id:
                hp = 200;
                break;
            case EnemyConfig.enemyConfig.enemy8.id:
                hp = 400;
                break;
            case EnemyConfig.enemyConfig.enemy9.id:
                hp = 800;
                break;
            case EnemyConfig.enemyConfig.enemyBomb.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*50;
                break;
            case EnemyConfig.enemyConfig.enemyBox.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*50;
                break;
            case EnemyConfig.enemyConfig.enemyFollow.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*30;
                break;
            case EnemyConfig.enemyConfig.enemyStay1.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*200;
                break;
            case EnemyConfig.enemyConfig.enemyStay2.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*200;
                break;
            case EnemyConfig.enemyConfig.enemyBoss1.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*500;
                break;
            case EnemyConfig.enemyConfig.enemyBoss2.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*1500;
                break;
            case EnemyConfig.enemyConfig.enemyBoss3.id:
                hp = Player.player.getBulletMaxGrade(Player.player.data.currentPlaneID)*5000;
                break;
        }
        return hp;
    }
}