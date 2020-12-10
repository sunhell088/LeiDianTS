import {Player} from "../../classes/Player";
import {GameUtil} from "../../common/GameUtil";
import {SoundConfig} from "../../configs/SoundConfig";
import {CommonConfig} from "../../configs/CommonConfig";
import BulletSprite from "../BulletSprite";
import ShipSprite from "../ShipSprite";
import {CLEAN_TYPE, FLY_STATE} from "../../common/GameEnum";
import {ObserverManager} from "../../framework/observe/ObserverManager";
import {GameEvent} from "../../common/GameEvent";


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

    public initSprite(spriteNode:cc.Node, atlas:cc.SpriteAtlas, pool:cc.NodePool, enemyConfig:any){
        this._spriteNode = spriteNode;
        this._spriteAtlas = atlas;
        this._spritePool = pool;
        this._enemyConfig = enemyConfig;
        this.resetBloodBar();
    }

    public setSpriteFrame(){
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
            let progress = this._HP / this._MAX_HP;
            this.bloodBar.progress = progress;
        }
    }
    //死亡
    death(bDrop){
        ObserverManager.sendNotification(GameEvent.KILL_ENEMY, this, bDrop);
        this.playDeathSound();
        this.destroySprite();
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
        GameUtil.playSound(SoundConfig.mon_die);
    }
    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        //子弹
        let bulletSprite:BulletSprite = other.getComponent(BulletSprite);
        if(bulletSprite){
            this.hurt(Player.player.getBulletPower(), true);
        }
        //玩家
        let shipSprite:ShipSprite = other.getComponent(ShipSprite);
        if(shipSprite){
            //冲刺 TODO
            // if(Player.player._spurt){
            //     self.size.width = CommonConfig.WIDTH/2;
            // }
            if(!Player.player._spurt&&!Player.player._bomb){
                shipSprite.hurt();
            }
            this.hurt(-1,true);
        }
        //敌机与玩家炸弹碰撞 TODO
    }
}