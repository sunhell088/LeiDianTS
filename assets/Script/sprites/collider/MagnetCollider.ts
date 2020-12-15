import ItemSprite from "../ItemSprite";
import {GameEvent} from "../../common/GameEvent";
import {ObserverManager} from "../../framework/observe/ObserverManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MagnetCollider extends cc.Component {

    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider) {
        let itemSprite:ItemSprite = other.node.getComponent(ItemSprite);
        if(itemSprite){
            ObserverManager.sendNotification(GameEvent.COLLIDER_MAGNET, itemSprite);
        }
    }
}