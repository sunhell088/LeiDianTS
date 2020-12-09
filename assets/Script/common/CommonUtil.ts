import {CommonConfig} from "../configs/CommonConfig";

export class CommonUtil {
    public static scaleFullRect(rect){
        rect.x = 0;
        rect.width = CommonConfig.WIDTH;
        rect.height += rect.height*(3-1);
    };

    public static scale2Rect(rect){
        rect.x -= rect.width/2;
        rect.y -= rect.height/2;
        rect.width += rect.width*(2-1);
        rect.height += rect.height*(2-1);
    };

    public static scaleHalfRect(rect){
        rect.x += rect.width/4;
        rect.width = rect.width/2;

        rect.y += rect.width/4;
        rect.height = rect.height/2;
    };

    public static random(min, maxInclud){
        return parseInt(Math.random()*(maxInclud-min+1)+min);
    };

//获得碰撞区域
    public static getCollideRect(sprite){
        let rect = cc.rect(sprite.x - sprite.width/2, sprite.y - sprite.height/2, sprite.width, sprite.height);
        if(!sprite.visible) {
            rect = cc.rect(0,0,0,0);
        }
        return rect;
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
    public static pClamp(sprite){
        let newPos:cc.Vec2 = sprite.getPosition();
        newPos = newPos.clampf(new cc.Vec2(sprite.width/2, sprite.height/2),
            new cc.Vec2(CommonConfig.WIDTH-sprite.width/2, CommonConfig.HEIGHT-sprite.height/2));
        sprite.setPosition(newPos);
    };

    public static getQualifiedClassName(value:any):string {
        let type = typeof value;
        if (!value || (type != "object"&&!value.prototype)) {
            return type;
        }
        let prototype:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        let constructorString:string = prototype.constructor.toString().trim();
        let index:number = constructorString.indexOf("(");
        let className:string = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
}