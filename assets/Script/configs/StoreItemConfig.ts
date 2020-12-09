import {Player} from "../classes/Player";
import FightScene from "../scene/FightScene";

export class StoreItemConfig {
    public static storeItemConfig:any = {
        //宙斯护盾
        protect:{
            id:"protect",
            name:"宙斯护盾",
            textureName:"#shop_icon0.png",
            sortValue:0,
            itemFunction:function(shipSprite){
                shipSprite.setProtect(true);
            },
            trigger:"start",
            description:"抵挡一次任何形式的伤害",
            showStore:true,
            price:1000
        },
        //炸弹（满载炸弹3枚）
        bomb:{
            id:"bomb",
            name:"炸弹3枚",
            textureName:"#shop_icon3.png",
            sortValue:0,
            itemFunction:function(){
                Player.player.addBomb(3);
            },
            trigger:"start",
            description:"开局就拥有3枚炸弹",
            showStore:true,
            price:1000
        },
        //复活甲（并且接力）
        revive:{
            id:"revive",
            name:"复活甲",
            textureName:"#shop_icon4.png",
            sortValue:0,
            itemFunction:function(){
                FightScene.getFightScene().onStoreRevive();
            },
            trigger:"start",
            description:"死亡后，使用其他战机接力作战",
            showStore:true,
            price:2000
        },
        //开局冲刺（从最好成绩处一半开始）
        spurt:{
            id:"spurt",
            name:"开局冲刺",
            textureName:"#shop_icon2.png",
            sortValue:0,
            itemFunction:function(){
                FightScene.getFightScene().onStoreSpurt();
            },
            trigger:"start",
            description:"开局冲刺3000米",
            showStore:true,
            price:2000
        },
        //死亡冲刺(冲刺本次距离1/10)
        death:{
            id:"death",
            name:"死亡冲刺",
            textureName:"#shop_icon8.png",
            sortValue:0,
            itemFunction:function(){
                FightScene.getFightScene().onStoreDeath();
            },
            trigger:"death",
            description:"拥有死亡后再冲刺1000米的能力",
            showStore:false,
            price:100
        },
        //开局可选择随机使用未拥有新战机一次
        changePlane:{
            id:"changePlane",
            name:"随机新战机",
            textureName:"#shop_icon9.png",
            sortValue:1,
            itemFunction:function(){
                FightScene.getFightScene().onStoreChangePlane();
            },
            trigger:"start",
            description:"开局可选择随机使用未拥有新战机一次",
            showStore:false,
            price:1000
        }
    };

    public static getStoreItemConfig(itemID):any{
        for(var p in StoreItemConfig.storeItemConfig){
            if(StoreItemConfig.storeItemConfig[p].id == itemID){
                return StoreItemConfig.storeItemConfig[p];
            }
        }
        return null;
    };
}