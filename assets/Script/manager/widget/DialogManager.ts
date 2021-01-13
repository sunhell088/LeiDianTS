import DialogUI from "../../scene/ui/common/DialogUI";

export class DialogManager{
    private static dialogManager:DialogManager = null;
    public static instance(): DialogManager {
        if(this.dialogManager==null){
            this.dialogManager = new DialogManager();
        }
        return this.dialogManager;
    }

    private dialogUI:DialogUI = null;

    public showDialog(dialogName:string) {
        if(this.dialogUI==null||this.dialogUI.node==null){
            cc.resources.load("prefabs/ui/dialogPrefab", cc.Prefab,function (err, prefab:cc.Prefab) {
                let dialogNode:cc.Node = cc.instantiate(prefab);
                DialogManager.instance().dialogUI = dialogNode.getComponent(DialogUI);
                cc.director.getScene().addChild(dialogNode);
                DialogManager.instance().dialogUI.setDialog(dialogName);
            });
        }else {
            this.dialogUI.setDialog(dialogName);
        }
    }

    public closeDialog() {
        this.dialogUI.node.active = false;
    }

    public inDialog():boolean{
        if(this.dialogUI!=null&&this.dialogUI.node!=null&&this.dialogUI.node.active){
            return true;
        }
        return false;
    }
}