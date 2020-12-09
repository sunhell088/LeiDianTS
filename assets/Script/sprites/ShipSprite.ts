import {Player} from "../classes/Player";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "../configs/SoundConfig";
import FightScene from "../scene/FightScene";
import {CLEAN_TYPE} from "../common/enum/FlyStateEnum";
import {CommonConfig} from "../configs/CommonConfig";
import FightUI from "../scene/ui/FightUI";
import {PlaneConfig} from "../configs/PlaneConfig";
import EnemySprite from "./enemy/EnemySprite";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ShipSprite extends cc.Component{
    //护盾动画
    @property(cc.Sprite)
    protectSprite:cc.Sprite = null;
    //磁铁动画
    @property(cc.Sprite)
    magnetSprite:cc.Sprite = null;
    //冲刺动画
    @property(cc.Sprite)
    spurtSprite:cc.Sprite = null;
    //机身
    @property(cc.Sprite)
    public shipSprite:cc.Sprite = null;
    //机身
    @property(cc.SpriteAtlas)
    public shipSpriteAtlas:cc.Sprite = null;
    //冲刺蓄能动画
    @property(cc.Sprite)
    spurtReadySprite:cc.Sprite = null;
    //升级特效—翅膀
    @property(cc.Sprite)
    levelUpWing:cc.Sprite = null;
    //升级特效—光圈
    @property(cc.Sprite)
    levelUpRing:cc.Sprite = null;
    //升级特效—喷光
    @property(cc.Sprite)
    levelUpJet:cc.Sprite = null;
    //升级特效—爆炸光
    @property(cc.Sprite)
    levelUpLight:cc.Sprite = null;
    //升级特效—飞机图
    @property(cc.Sprite)
    levelUpBigPlane:cc.Sprite = null;
    @property(cc.Node)
    deadEffect:cc.Node = null;
    @property(cc.Node)
    playerSprintExplode:cc.Node = null;
    @property(cc.Node)
    eatItemEffect:cc.Node = null;

    public static getShipSprite(): ShipSprite {
        return cc.find("Canvas/shipNode").getComponent(ShipSprite);
    }

    //重置飞机能力
    resetEffect(){
        this.setMagnet(false);
        Player.player._doublePower = false;
        Player.player._doubleFire = false;
        this.setProtect(false);
    }

    comeOnStage(){
        //登场动画;
        this.node.setPosition(0,-CommonConfig.HEIGHT-this.node.height);
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.moveTo(0.4, this.node.x, -CommonConfig.HEIGHT/5),
            cc.moveTo(0.3, this.node.x, -CommonConfig.HEIGHT/3),
            cc.callFunc(function(){
                Player.player._stopBullet = false;
            })
        ));
    }
    //更换飞机
    changePlane(planeConfig){
        this.node.runAction(cc.sequence(
            //更换图片（赋予新飞机的功能）
            cc.callFunc(function(){
                this.resetEffect();
                let frame = this._spriteAtlas.getSpriteFrame(planeConfig.fightTextureName);
                this.shipSprite.getComponent(cc.Sprite).spriteFrame = frame;
                Player.player.data.currentPlaneID = planeConfig.id;
                planeConfig.planeFunction(this);
                //炸弹清屏
                FightScene.getFightScene().createBomb();
            }, this),
            //登场
            cc.callFunc(this.comeOnStage,this)
        ));

    }
    //显示护盾
    setProtect(state:boolean){
        Player.player._protecting = state;
        this.protectSprite.node.active = state;
    }

    //显示磁铁
    setMagnet(state:boolean){
        Player.player._magnet = state;
        this.magnetSprite.node.active = state;
    }

    //双击
    onDoubleClick(){
        if(Player.player._bomb||Player.player._spurt||Player.player._spurtReadying||Player.player._levelUpIng) return;
        if(!Player.player.useBomb()){
            this.node.runAction(GameUtil.shakeBy(0.2,5,5));
            return;
        }
        FightScene.getFightScene().createBomb();
    }

    destroyShipSprite(){
        this.node.active = false;
    }

    hurt(){
        if(Player.player._invincible||Player.player.debugMode) return;
        let fightScene:FightScene = FightScene.getFightScene();
        //是否在护盾状态下
        if(Player.player._protecting){
            GameUtil.playEffect(SoundConfig.shield);  //音效
            FightScene.getFightScene().cleanEnemy(CLEAN_TYPE.ALL, true);
            this.protectSprite.node.stopAllActions()
            this.protectSprite.node.runAction(cc.sequence(cc.scaleBy(0.4,40),
                cc.callFunc(function(){this.setProtect(false);},this)));
        }//判断是否有接力
        else if(Player.player._revivePlaneID>0){
            this.death();
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(this.storeItemRevive,this)
            ));
        }
        //判断死亡时是否有商城道具触发
        else if(!fightScene.storeItemEffect("death")){
            this.death();
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(fightScene.onGameOver)
            ));
        }
    }

    //死亡
    death(){
        //音效
        GameUtil.playEffect(SoundConfig.firework);
        Player.player._death = true;
        Player.player._stopBullet = true;
        this.deadEffect.active = true;
        this.deadEffect.getComponent(cc.Animation).play();
        cc.tween(FightScene.getFightScene().canvas).then(GameUtil.shakeBy(0.5,50,10));
        this.destroyShipSprite();
    }

    eatItem(itemSprite){
        itemSprite._itemConfig.itemFunction();
    }
    //道具复活
    storeItemRevive(){
        Player.player._changePlaneIng = true;
        //出现道具图标
        var storeItemIcon = FightUI.getFightUI().storeItemRevive;
        storeItemIcon.node.setPosition(CommonConfig.WIDTH/2, CommonConfig.HEIGHT/2);
        storeItemIcon.node.scale = 8;
        storeItemIcon.node.runAction(cc.sequence(
            cc.callFunc(function(){
                storeItemIcon.node.active = true
            }),
            cc.scaleTo(0.2,1),
            GameUtil.shakeBy(0.3,10,5),
            cc.delayTime(0.5),
            GameUtil.getHideSelfCallFun(storeItemIcon.node),
            cc.callFunc(function(){
                ShipSprite.getShipSprite().revive();
                ShipSprite.getShipSprite().changePlane(PlaneConfig.getPlaneConfig(Player.player._revivePlaneID));
                Player.player._revivePlaneID = 0;
            }),
            cc.delayTime(1),
            cc.callFunc(function(){
                Player.player._changePlaneIng = false;
            })
        ));
    }

    revive(){
        Player.player._death = false;
        this.node.active = true
        Player.player._stopBullet = false;
    }

    attractItem(itemSprite){
        if(itemSprite._bAttracting) return;
        itemSprite.stopAllActions();
        let moveTo = cc.moveTo(0.1, new cc.Vec2(this.node.x, this.node.y));
        itemSprite.runAction(cc.sequence(
            moveTo,
            cc.callFunc(itemSprite.destroy, itemSprite),
            cc.callFunc(this.eatItem, this, itemSprite)
        ));

        itemSprite._bAttracting = true;
    }

    //升级动画
    levelUpAction() {
        //音效
        GameUtil.playEffect(SoundConfig.levelUpReady);
        Player.player._invincible = true;
        Player.player._levelUpIng = true;
        FightScene.getFightScene().cleanEnemy(CLEAN_TYPE.ALL, true);

        //-----------------临时变量--------------------
        let fightUI:FightUI = FightUI.getFightUI();
        //特效文字图片
        var title:cc.Sprite = fightUI.levelUpTitle;
        //人物图片
        var man:cc.Sprite = fightUI.levelUpMan;
        //翅膀图片
        var wing:cc.Sprite = this.levelUpWing;
        //光圈图片
        var ring:cc.Sprite = this.levelUpRing;
        //尾巴喷光图片
        var jet:cc.Sprite = this.levelUpJet;
        //爆炸光图片
        var light:cc.Sprite = this.levelUpLight;

        var Bigplane:cc.Sprite = this.levelUpBigPlane




        //-------------------初始化(动画中会变的元素)---------------------

        title.node.setPosition(-title.node.width/2, CommonConfig.HEIGHT - title.node.height * 3 / 2);

        man.spriteFrame = fightUI.levelUpManSpriteFrame[Player.player.data.currentPlaneID]
        man.node.setPosition(CommonConfig.WIDTH + man.node.width / 2, CommonConfig.HEIGHT - man.node.height * 5 / 2);

        ring.node.scale = 0.5;
        ring.node.opacity = 150;

        light.node.active = false;

        wing.node.scale = 1;

        Bigplane.node.scale = 8;

        //----------------------动画开始---------------------------------------
        title.node.active = true;
        man.node.active = true;

        Bigplane.node.active = true;


        var titleMoveBy = cc.moveBy(0.3, new cc.Vec2(title.node.width / 2 + CommonConfig.WIDTH/2, 0));
        var manMoveBy = cc.moveBy(0.3, new cc.Vec2(-(man.node.width / 2 + CommonConfig.WIDTH/2), 0));

        //半透明飞船从大到小的效果  以及标题和头像图片出现
        var action1 = function(){
            this.node.runAction(cc.sequence(
                cc.callFunc(function(){
                    Bigplane.node.runAction(cc.scaleTo(0.5, 1));
                    title.node.runAction(titleMoveBy);
                    man.node.runAction(manMoveBy);
                }, this),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    Bigplane.node.active = false;
                }, this)
            ));

        }

        //光圈以及飞机变大动作：出现、放大
        var ringAction = function(){
            var ring2ScaleTo = cc.scaleTo(0.2, 8);
            var ringFadeTo = cc.fadeTo(0.2, 255);

            ring.node.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    ring.node.active = true;
                }, this),
                cc.delayTime(0.3),
                //飞机变为两倍、翅膀、喷气出现
                cc.callFunc(function(){
                    ring.node.active = true;
                    light.node.active = true;
                    this.scale = 2;
                    jet.node.active = true;
                    wing.node.active = true;
                }, this),
                cc.spawn(ring2ScaleTo,ringFadeTo),
                cc.delayTime(0.2),
                //光圈可见度设为false
                cc.callFunc(function(){
                    ring.node.active = false;
                }, this)
            ));
        };

        //标题和头像文字移动走
        var hideSome = function(){
            title.node.runAction(cc.sequence(
                titleMoveBy,
                cc.callFunc(function(){
                    title.node.active = false;
                }, this)));

            man.node.runAction(cc.sequence(
                manMoveBy,
                cc.callFunc(function(){
                    man.node.active = false;
                }, this)));
            Player.player._levelUpIng = false;
            //进入升级中无敌子弹状态音效
            GameUtil.playEffect(SoundConfig.levelUpIng);
        };

        //飞机回归正常大小 翅膀折叠
        var planeScaleToNormal = function(){
            var planeScaleToNormal = cc.scaleTo(0.2, 1);
            var wingScaleTo = cc.scaleTo(0.2, 0, 1);
            this.node.runAction(cc.sequence(
                cc.callFunc(function(){
                    wing.node.runAction(wingScaleTo);
                }, this),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    this.node.runAction(planeScaleToNormal);
                }, this)));
        }

        //翅膀喷气消失(并且升级状态复原)
        var hideAll = function(){
            wing.node.active = false;
            jet.node.active = false;

            Player.player._invincible = false;
        };

        this.node.runAction(cc.sequence(
            //0.5s
            cc.callFunc(action1, this),
            //0.4s
            cc.callFunc(ringAction, this),
            cc.delayTime(1.4),
            //0.3s
            cc.callFunc(hideSome, this),
            //升级特效维持时间
            cc.delayTime(2.5),
            //0.4s
            cc.callFunc(planeScaleToNormal, this),
            cc.delayTime(0.5),
            cc.callFunc(hideAll, this)
        ));
    }

    getPlayerSprintExplodeAnimation(){
        this.playerSprintExplode.active = true;
        this.playerSprintExplode.getComponent(cc.Animation).play();
        return new cc.ActionInterval;
    }

    playEatItemEffectAnimation(){
        this.eatItemEffect.getComponent(cc.Animation).play();
    }
}