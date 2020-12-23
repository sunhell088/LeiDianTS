/**
 * Created by kurt on 2015/3/23.
 */
import {CommonUtil} from "./CommonUtil";

export default class ShakeActionInterval extends cc.ActionInterval{

    private m_strength_x:number = 0;
    private m_strength_y:number = 0;

    private m_StartPosition:cc.Vec2 =null;

    private m_shakePerTime:number = 0;
    private m_shakePassTime:number = 0;

    constructor(duration, shakeCount, strength_x, strength_y){
        super();
        cc.ActionInterval.prototype.constructor.call(this);
        if(shakeCount>0)
            this.m_shakePerTime = duration/shakeCount;
        duration && this.initWithDuration(duration, strength_x, strength_y);
    }

    // @ts-ignore
    initWithDuration(duration, strength_x, strength_y){
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration))
        {
            this.m_strength_x = strength_x;
            this.m_strength_y = strength_y;
            return true;
        }
        return false;
    }

    update(dt){
        dt = this.getDuration()*dt;
        if(dt<this.m_shakePassTime) return;
        this.m_shakePassTime += this.m_shakePerTime;
        let randomX = this.m_StartPosition.x + CommonUtil.random( -this.m_strength_x, this.m_strength_x );
        let randomY = this.m_StartPosition.y + CommonUtil.random( -this.m_strength_y, this.m_strength_y );
        this.getTarget().setPosition(new cc.Vec2( randomX, randomY));
    }

    // @ts-ignore
    startWithTarget(target){
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        // save the initial position
        this.m_StartPosition=target.getPosition();
    }

    // @ts-ignore
    stop(){
        // Action is done, reset clip position
        this.getTarget().setPosition(this.m_StartPosition);
        cc.Action.prototype.stop.call(this);
    }
}
