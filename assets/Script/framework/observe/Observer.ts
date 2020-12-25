/**
 * 观察者
 **/
import {CommonUtil} from "../../common/CommonUtil";

export class Observer {
    //所有被监听的方法
    private _registerObservers:Object = {};

    public registerObserverFun(observer:any):void {
        var medCommands:string[] = observer.getCommands();
        if (!medCommands) return;
        var observerList:any[];
        for (var i:number = 0; i < medCommands.length; i++) {
            if (!this._registerObservers.hasOwnProperty(medCommands[i])) {
                this._registerObservers[medCommands[i]] = [];
            }
            observerList = this._registerObservers[medCommands[i]];
            if (observerList.indexOf(observer) == -1) {
                observerList.push(observer);
            }
        }
    }

    public unRegisterObserverFun(observer:any):void {
        var medCommands:string[] = observer.getCommands();
        if (!medCommands) return;
        var observerList:any[];
        for (var i:number = 0; i < medCommands.length; i++) {
            if (!this._registerObservers.hasOwnProperty(medCommands[i])) {
                continue;
            }
            observerList = this._registerObservers[medCommands[i]];
            let index = observerList.indexOf(observer);
            if (index != -1) {
                observerList.splice(index,1);
            }
        }
    }

    public send(command:string, arg:Array<any> = null):void {
        var observerList:any[] = this._registerObservers[command];
        if (observerList == null){
            console.error(command+" has not been registered");
            return;
        }
        var fun:Function;
        var oneObserver:any;
        for (var i:number = 0; i < observerList.length; i++) {
            oneObserver = observerList[i];
            if (oneObserver == null) {
                console.error(command);
                continue;
            }
            fun = oneObserver[command];
            if (fun == null) {
                console.error("Observer send , function is null! command = "+command)
            }
            else if (arg == null || arg.length == 0)
                fun.call(oneObserver);
            else
                fun.apply(oneObserver, arg);
        }
    }
}
