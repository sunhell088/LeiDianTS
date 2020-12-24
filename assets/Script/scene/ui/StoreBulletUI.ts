import {Player} from "../../classes/Player";

const {ccclass, property} = cc._decorator;
@ccclass
export default class StoreBulletUI extends cc.Component{
    //子弹图片
    @property(cc.Sprite)
    bulletSprite:cc.Sprite=  null;
    //子弹图集
    @property(cc.SpriteAtlas)
    bulletAtlas:cc.SpriteAtlas =  null;
    //子弹图片上等级
    @property(cc.Label)
    levelLab:cc.Label =  null;

    private cloneNode:cc.Node = null;
    public bulletLevel:number = -1;
    private planeID:number = -1;
    private gridIndex:number = -1;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event){
        if(this.bulletLevel<=0) return;
        this.cloneNode = cc.instantiate(this.node);
        this.node.parent.addChild(this.cloneNode);
        this.node.setSiblingIndex(100);
    }
    onTouchMove(event) {
        if(this.bulletLevel<=0) return;
        this.node.position = this.node.parent.convertToNodeSpaceAR(event.getLocation());
    }

    onTouchEnd(event) {
        if(this.bulletLevel<=0) return;
        this.cloneNode.destroy();
        this.node.setPosition(this.cloneNode.getPosition())
        let touch = event.currentTouch;
        let touchPos = this.node.parent.convertToNodeSpaceAR(touch.getLocation());
        for(let i=0;i<this.node.parent.children.length;i++){
            let node:cc.Node = this.node.parent.children[i];
            let storeBulletUI:StoreBulletUI = node.getComponent(StoreBulletUI);
            if(storeBulletUI.gridIndex==this.gridIndex) continue;
            if(touchPos.x>node.x-node.width/2&&touchPos.x<node.x+node.width/2
            &&touchPos.y>node.y-node.height/2&&touchPos.y<node.y+node.height/2){
                Player.player.combineStoreBullet(this.planeID, this.gridIndex, storeBulletUI.gridIndex, false);
                break;
            }
        }
    }

    public setBullet(planeID:number, type:number, level:number, gridIndex:number){
        if(this.cloneNode&&this.cloneNode.parent){
            this.cloneNode.destroy();
        }
        this.planeID = planeID;
        this.bulletLevel = level;
        this.gridIndex = gridIndex;
        if(level==0){
            this.bulletSprite.node.active = false;
            this.levelLab.node.active = false;
        }else {
            this.bulletSprite.node.active = true;
            this.levelLab.node.active = true;
            this.levelLab.string = "Lv."+level;
            this.bulletSprite.spriteFrame = this.bulletAtlas.getSpriteFrame(type + '_' + level);
        }
    }

    public autoCombineTarget(targetGrid:StoreBulletUI){
        this.cloneNode = cc.instantiate(this.node);
        this.node.parent.addChild(this.cloneNode);
        this.bulletSprite.node.active = false;
        this.levelLab.node.active = false;
        cc.tween(this.cloneNode).to(0.5, {x:targetGrid.node.x, y:targetGrid.node.y})
            .call(function () {
                Player.player.combineStoreBullet(this.planeID, this.gridIndex, targetGrid.gridIndex, true);
        // @ts-ignore
        },this).start();
    }

}