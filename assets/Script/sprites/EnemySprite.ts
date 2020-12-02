import {CommonConfig} from "../configs/CommonConfig";
import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "../configs/SoundConfig";

enum FLY_STATE{
    ENTER=0,
    RUN=1,
    EXIT=2
}
const {ccclass, property} = cc._decorator;
@ccclass
export default class EnemySprite extends cc.Component {

    _spritePrefab:cc.Node = null;
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

    initSprite(prefab:cc.Node, atlas:cc.SpriteAtlas, pool:cc.NodePool, enemyConfig:any){
        this._spritePrefab = prefab;
        this._spriteAtlas = atlas;
        this._spritePool = pool;
        this._enemyConfig = enemyConfig
    }

    setSpriteFrame(){
        let frame = this._spriteAtlas.getSpriteFrame(this._enemyConfig.id);
        this.getComponent(cc.Sprite).spriteFrame = frame;
    }

    update (dt) {
        var speed = Player.player._spurt?CommonConfig.ENEMY_SPURT_SPEED:(CommonConfig.ENEMY_SPEED+Player.player._enemyAddSpeed);
        this.node.y -= speed*dt;
        if(this.node.y < -CommonConfig.HEIGHT_HALF*2) this.destroySprite();
    }

    destroySprite () {
        this._spritePool.put(this._spritePrefab);
        this.resetBloodBar();
        this.flyState = FLY_STATE.ENTER;
    }
    //清理血条精灵的状态(为下一次使用准备)
    resetBloodBar(){
        this.bloodBar.node.active = false;
    }

    hurt(bulletPower,bDrop){
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