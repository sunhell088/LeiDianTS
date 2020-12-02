import {Player} from "../classes/Player";
import {PlaneConfig} from "./PlaneConfig";
import {CommonConfig} from "./CommonConfig";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "./SoundConfig";
import {ObserverManager} from "../framework/observe/ObserverManager";
import {GameEvent} from "../common/GameEvent";
import {CommonUtil} from "../common/CommonUtil";

export class ItemConfig {
    public static itemConfig = {
        //冲刺
        item_cc:{
            name:"item_cc",
            textureName:"#item_cc.png",
            presetCount:2,
            effectTexture:"#fly_buff0.png",
            itemFunction:function(){
                ObserverManager.sendNotification(GameEvent.SPURT_ACTION);
            }
        },
        //二条
        item_doubleFire:{
            name:"item_doubleFire",
            textureName:"#item_up_skill.png",
            presetCount:2,
            effectTexture:"#fly_buff4.png",
            itemFunction:function(){
                ObserverManager.sendNotification(GameEvent.DOUBLE_FIRE_ACTION);
            }
        },
        //磁铁
        item_xts:{
            name:"item_xts",
            textureName:"#item_xts.png",
            presetCount:2,
            effectTexture:"#fly_buff1.png",
            itemFunction:function(){
                ObserverManager.sendNotification(GameEvent.XTS_ACTION);
            }
        },
        //炸弹
        item_down_skill:{
            name:"item_down_skill",
            textureName:"#item_down_skill.png",
            presetCount:2,
            effectTexture:"#fly_buff5.png",
            itemFunction:function(){
                Player.player.addBomb();
                //特效
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_down_skill);
            }
        },
        //10金币
        item_coin:{
            name:"item_coin",
            textureName:"#item_coin.png",
            presetCount:20,
            gold:10,
            itemFunction:function(){
                Player.player.addCurrentRewardGold(this.gold);
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_coin);
            }
        },
        //50金币
        item_red:{
            name:"item_red",
            textureName:"#item_red.png",
            presetCount:7,
            gold:50,
            itemFunction:function(){
                Player.player.addCurrentRewardGold(this.gold);
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_red);
            }
        },
        //100金币
        item_green:{
            name:"item_green",
            textureName:"#item_green.png",
            presetCount:5,
            gold:100,
            itemFunction:function(){
                Player.player.addCurrentRewardGold(this.gold);
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_green);
            }
        }
    };

    //吃道具特效
    public static eatItemEffect (itemConfig){
        ObserverManager.sendNotification(GameEvent.EAT_ITEM, itemConfig);
    };
}