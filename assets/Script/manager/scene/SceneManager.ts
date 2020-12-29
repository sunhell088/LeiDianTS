export class SceneManager{
    private static sceneManager:SceneManager = null;
    public static instance(): SceneManager {
        if(this.sceneManager==null){
            this.sceneManager = new SceneManager();
        }
        return this.sceneManager;
    }

    public changeScene(newSceneName:string) {
        cc.resources.load("prefabs/loadingPrefab", function (err, prefab) {
            let loadingNode:any = cc.instantiate(prefab);
            cc.director.getScene().addChild(loadingNode);
            let progressBar:cc.ProgressBar = loadingNode.getChildByName("progressBar").getComponent(cc.ProgressBar);
            let progressBG:cc.Node = loadingNode.getChildByName("bg");
            //这里注册一个空方法，来阻止点击穿透
            progressBG.on(cc.Node.EventType.TOUCH_END,  ()=> {}, this);
            progressBar.progress = 0;
            cc.director.preloadScene(newSceneName, (completedCount, totalCount, item)=>{
                if(completedCount/totalCount>progressBar.progress){
                    progressBar.progress = completedCount/totalCount;
                }
            }, (error)=>{
                cc.director.loadScene(newSceneName);
            })
        });
    }
}