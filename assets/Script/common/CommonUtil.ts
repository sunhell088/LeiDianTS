import {CommonConfig} from "../configs/CommonConfig";

export class CommonUtil {

    public static random(min, maxInclude){
        return parseInt(Math.random()*(maxInclude-min+1)+min);
    };


    //获得预创碰撞区域(并且每次重置)
    public static getPresetCollideRect(sprite){
        if(sprite.visible){
            sprite._collideRect.x = sprite.x - sprite.width / 2;
            sprite._collideRect.y = sprite.y - sprite.height / 2;
            sprite._collideRect.width = sprite.width;
            sprite._collideRect.height = sprite.height;
        }else{
            sprite._collideRect.x = 0;
            sprite._collideRect.y = 0;
            sprite._collideRect.width = 0;
            sprite._collideRect.height = 0;
        }
        return sprite._collideRect;
    };

    //控制范围
    public static pClamp(node:cc.Node){
        let newPos:cc.Vec2 = node.getPosition();
        newPos = newPos.clampf(new cc.Vec2(-CommonConfig.WIDTH/2+node.width/2, node.height/2),
            new cc.Vec2(CommonConfig.WIDTH/2-node.width/2, CommonConfig.HEIGHT/2-node.height/2));
        node.setPosition(newPos);
    };
    
    //获得两点距离
    public static getDistanceByTwePoint(point1:cc.Vec2, point2:cc.Vec2):number {
        let dist = point1.sub(point2).mag();
        return dist
    }
}