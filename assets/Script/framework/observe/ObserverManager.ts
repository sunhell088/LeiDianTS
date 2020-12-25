/**
 * 模块监听管理，用于游戏模块分离
 **/
import {Observer} from "./Observer";
import log = cc.log;

export class ObserverManager {
    private static observer:Observer = new Observer();

    public static sendNotification(command:string, ...arg) {
        ObserverManager.observer.send(command, arg);
    }

    public static registerObserverFun(obj:any) {
        ObserverManager.observer.registerObserverFun(obj);
    }

    public static unRegisterObserverFun(obj:any) {
        ObserverManager.observer.unRegisterObserverFun(obj);
    }
}