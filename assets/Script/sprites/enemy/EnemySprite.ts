import {Player} from "../../classes/Player";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import {FLY_STATE} from "../../common/enum/FlyStateEnum";


const {ccclass, property} = cc._decorator;
@ccclass
export default class EnemySprite extends cc.Component {
    _spriteNode:cc.Node = null;
    _spriteAtlas:cc.SpriteAtlas = null;
    _spritePool:cc.NodePool = null;

    _enemyConfig:any = null;
    _MAX_HP:number = 0;
    _HP:number = 0;
    _expValue:number = 0;
    _dropItems:any = null;
    @property(cc.ProgressBar)
    bloodBar:cc.ProgressBar = null;

    //飞行状态
    flyState:FLY_STATE = FLY_STATE.ENTER;

    initSprite(spriteNode:cc.Node, atlas:cc.SpriteAtlas, pool:cc.NodePool, enemyConfig:any){
        this._spriteNode = spriteNode;
        this._spriteAtlas = atlas;
        this._spritePool = pool;
        this._enemyConfig = enemyConfig;
        this.resetBloodBar();
    }

    setSpriteFrame(){
        this.node.setPosition(0, 0);
        let frame = this._spriteAtlas.getSpriteFrame(this._enemyConfig.textureName);
        this.getComponent(cc.Sprite).spriteFrame = frame;
    }

    update (dt) {
        var speed = Player.player._spurt?CommonConfig.ENEMY_SPURT_SPEED:(CommonConfig.ENEMY_SPEED+Player.player._enemyAddSpeed);
        this.node.y -= speed*dt;
        if(this.node.y < -this.node.parent.height/2-this.node.height) this.destroySprite();
    }

    destroySprite () {
        this._spritePool.put(this._spriteNode);
        this.resetBloodBar();
        this.flyState = FLY_STATE.ENTER;
    }
    //清理血条精灵的状态(为下一次使用准备)
    resetBloodBar(){
        this.bloodBar.progress = 1;
        this.bloodBar.node.active = false;
    }

    hurt(bulletPower,bDrop){
        this.bloodBar.node.active = true;
        if(bulletPower==-1){
            this._HP = 0;
        }else{
            this._HP -= bulletPower;
        }
        if(this._HP<=0){
            this.death(bDrop);
        }else{
            //设置血条长度
            this.bloodBar.progress = Math.round(this._HP / this._MAX_HP * 100)
        }
    }
    //死亡
    death(bDrop){
        // this.destroy();
        // if(bDrop){
        //     g_sharedGameLayer.killEnemyAward(this);
        // }
        // //冲刺阶段一半几率显示爆炸效果
        // if(!g_sharedGameLayer._spurt||Math.random()>0.5){
        //     //音效
        //     this.playDeathSound();
        //     var effect = null;
        //     //自爆飞机
        //     if(this._enemyConfig==EnemyConfig.enemyBomb){
        //         effect = EffectSprite.getEffect(EffectConfig.bomb_efx1.name);
        //         if(effect){
        //             effect.setScale(3);
        //         }
        //         g_sharedGameLayer.cleanEnemy(3, true);
        //     }else{
        //         effect = EffectSprite.getEffect(EffectConfig.efx_bomb2.name);
        //         if(effect){
        //             effect.setScale(2);
        //         }
        //     }
        //     if(effect){
        //         effect.x = this.x;
        //         effect.y = this.y;
        //     }
        // }
    }

    //动态设置敌机的血量、经验和掉落物品
    setDynamicData(hp, exp, items){
        this._MAX_HP = hp;
        this._HP = this._MAX_HP;
        this._expValue = exp;
        this._dropItems = [];
        if(items){
            if(items instanceof Array){
                this._dropItems = items;
            }else{
                this._dropItems.push(items);
            }
        }
    }
    //死亡音效（子类重载）
    playDeathSound(){
        //音效
        GameUtil.playEffect(SoundConfig.mon_die);
    }
}