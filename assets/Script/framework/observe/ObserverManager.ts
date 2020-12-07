/**
 * 模块监听管理，用于游戏模块分离
 **/
import {Observer} from "./Observer";

export class ObserverManager {
    private static observer:Observer = new Observer();
    private static _mediators:Object = {};
    private static _commands:Object = {};

    public static sendNotification(command:string, ...arg) {
        ObserverManager.observer.send(command, arg);
    }

    public static registerObserverFun(obj:any) {
        ObserverManager.observer.registerObserverFun(obj);
    }
}