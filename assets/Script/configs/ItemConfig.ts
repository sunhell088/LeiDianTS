import {Player} from "../classes/Player";
import {CommonConfig} from "./CommonConfig";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "./SoundConfig";
import FightScene from "../scene/FightScene";
import {CLEAN_TYPE} from "../common/enum/FlyStateEnum";
import ShipSprite from "../sprites/ShipSprite";
import FightUI from "../scene/ui/FightUI";

export class ItemConfig {
    public static itemConfig = {
        //冲刺
        item_cc:{
            name:"item_cc",
            textureName:"item_cc",
            presetCount:2,
            effectTexture:"#fly_buff0.png",
            itemFunction:function(){
            //     if(Player.player._spurt||Player.player._spurtReadying) return;
            //     //吃道具效果
            //     ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_cc);
            //     //冲刺持续时间（分为普通冲刺、开局道具冲刺、死亡冲刺）
            //     var spurtDuration = Player.player._startSpurtDuration>0?Player.player._startSpurtDuration:CommonConfig.SPURT_DURATION;
            //     spurtDuration = Player.player._deathSpurtDuration>0?Player.player._deathSpurtDuration:spurtDuration;
            //     //冲刺准备
            //     var spurtReadyAction = cc.callFunc(
            //         function(){
            //             //音效
            //             GameUtil.playEffect(SoundConfig.cc_ready);
            //             Player.player._spurtReadying = true;
            //             //清屏
            //             FightScene.getFightScene().cleanEnemy();
            //             //蓄能动画
            //             var spurtReadySprite:cc.Sprite = ShipSprite.getShipSprite().spurtReadySprite;
            //             spurtReadySprite.node.active = true;
            //             var animate:cc.ActionInterval = ShipSprite.getShipSprite().getPlayerSprintExplodeAnimation();
            //             spurtReadySprite.node.runAction(cc.sequence(
            //                 animate,
            //                 GameUtil.getHideSelfCallFun(spurtReadySprite.node)
            //             ));
            //         },null
            //     );
            //     //冲刺开始
            //     var spurtStartAction = cc.callFunc(
            //         function(){
            //             //开始冲刺
            //             Player.player._spurtReadying = false;
            //             FightScene.getFightScene().setSpurt(true);
            //             FightScene.getFightScene().unschedule(FightScene.getFightScene().scheduleNormalEnemy);
            //             FightScene.getFightScene().schedule(FightScene.getFightScene().scheduleNormalEnemy, CommonConfig.ENEMY_SPURT_DELAY);
            //         },null
            //     );
            //     //冲刺结束
            //     var spurtOverAction = cc.callFunc(
            //         function(){
            //             //爆炸效果
            //             ShipSprite.getShipSprite().levelUpRing.node.active = true;
            //             ShipSprite.getShipSprite().levelUpLight.node.active = false;
            //             ShipSprite.getShipSprite().levelUpRing.node.scale = 0.5;
            //             ShipSprite.getShipSprite().levelUpRing.node.runAction(cc.sequence(cc.scaleBy(1,50),
            //                 cc.callFunc(function(){
            //                     ShipSprite.getShipSprite().levelUpRing.node.active = false;
            //                     ShipSprite.getShipSprite().levelUpRing.node.scale = 1;
            //                 },null)
            //             ));
            //             //冲刺完时当前屏幕的飞机暴落物品
            //             var enemyArray = [];
            //             for(var e=0; e<VVV.CONTAINER.ENEMYS_CHECK_COLLIDE.length; e++){
            //                 var enemy = VVV.CONTAINER.ENEMYS_CHECK_COLLIDE[e];
            //                 if(!enemy.visible) continue;
            //                 enemyArray.push(enemy);
            //             }
            //             //暴落当前飞机数目的两倍
            //             var dropItemArray = VVV.getDropItemArray(enemyArray.length);
            //             for(var i=0;i<dropItemArray.length;i++){
            //                 var item = ItemSprite.getItem(dropItemArray[i]);
            //                 if(!item) continue;
            //                 item.setPosition(enemyArray[i].getPosition());
            //                 if(i<enemyArray.length){
            //                     item.x += hlx.random(-100,100);
            //                     item.y += hlx.random(0,100);
            //                 }
            //                 item.drop();
            //             }
            //
            //             g_sharedGameLayer.setSpurt(false);
            //             g_sharedGameLayer.cleanEnemy();
            //             g_sharedGameLayer.unschedule(g_sharedGameLayer.scheduleNormalEnemey);
            //             g_sharedGameLayer.schedule(g_sharedGameLayer.scheduleNormalEnemey, VVV.ENEMY_DELAY);
            //             //开局冲刺标识重置
            //             g_sharedGameLayer._startSpurtDuration = 0;
            //             //死亡冲刺后死掉
            //             if(g_sharedGameLayer._deathSpurtDuration>0){
            //                 g_sharedGameLayer._ship.death();
            //                 g_sharedGameLayer._ship.runAction(cc.sequence(
            //                     cc.delayTime(1),
            //                     cc.callFunc(g_sharedGameLayer.onGameOver)
            //                 ));
            //             }
            //         },
            //         null
            //     );
            //
            //     g_sharedGameLayer.runAction(cc.sequence(
            //         spurtReadyAction,
            //         cc.delayTime(0.5),
            //         spurtStartAction,
            //         cc.delayTime(spurtDuration),
            //         spurtOverAction
            //     ));
            //     ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_down_skill);
            }
        },
        //二条
        item_doubleFire:{
            name:"item_doubleFire",
            textureName:"item_up_skill",
            presetCount:2,
            effectTexture:"#fly_buff4.png",
            itemFunction:function(){
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_down_skill);
            }
        },
        //磁铁
        item_xts:{
            name:"item_xts",
            textureName:"item_xts",
            presetCount:2,
            effectTexture:"#fly_buff1.png",
            itemFunction:function(){
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_down_skill);
            }
        },
        //炸弹
        item_down_skill:{
            name:"item_down_skill",
            textureName:"item_down_skill",
            presetCount:2,
            effectTexture:"#fly_buff5.png",
            itemFunction:function(){
                Player.player.addBomb();
                ItemConfig.eatItemEffect(ItemConfig.itemConfig.item_down_skill);
            }
        },
        //10金币
        item_coin:{
            name:"item_coin",
            textureName:"item_coin",
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
            textureName:"item_red",
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
            textureName:"item_green",
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
        ShipSprite.getShipSprite().playEatItemEffectAnimation()
        if(itemConfig.gold){
            //音效
            if(itemConfig == ItemConfig.itemConfig.item_coin){
                GameUtil.playEffect(SoundConfig.get_coin);
            }else{
                GameUtil.playEffect(SoundConfig.get_bs);
            }
        }else{
            FightUI.getFightUI().playShowEatItemName(itemConfig.name);
            //音效
            GameUtil.playEffect(SoundConfig.get_item);
        }
    };
}