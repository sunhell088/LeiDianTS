
const {ccclass, property} = cc._decorator;
@ccclass
export default class StoreBulletUI extends cc.Component{
    //子弹图片
    @property(cc.Sprite)
    bulletSprite:cc.Sprite=  null;
    //子弹图集
    @property(cc.SpriteAtlas)
    bulletAtlas:cc.SpriteAtlas =  null;
    //子弹图集
    @property(cc.Label)
    levelLab:cc.Label =  null;


}