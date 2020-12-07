import {CommonUtil} from "../common/CommonUtil";
import {CommonConfig} from "../configs/CommonConfig";
import {ItemConfig} from "../configs/ItemConfig";
import FightScene from "../scene/FightScene";

const {ccclass, property} = cc._decorator;
@ccclass
export default class RockSprite extends cc.Component {
    _spritePrefab: cc.Node = null;
    _spriteAtlas: cc.SpriteAtlas = null;
    _spritePool: cc.NodePool = null;


    //获得碰撞区域
    getCollideRect(){
        // this._collideRect.x = this.x - this.width/2;
        // this._collideRect.y = this.y - this.height/2;
        // this._collideRect.width = this.width;
        // this._collideRect.height = this._collideRect.width;
        // //缩小4倍
        // CommonUtil.scaleHalfRect(this._collideRect);
        // CommonUtil.scaleHalfRect(this._collideRect);
        // return this._collideRect;
    }
    destroySprite(){
        this.node.active = false;
    }
    update(dt){
        this.node.y -= CommonConfig.ROCK_SPEED*dt;
        if(this.node.y < -CommonConfig.HEIGHT_HALF*2) this.destroySprite();
    }
}