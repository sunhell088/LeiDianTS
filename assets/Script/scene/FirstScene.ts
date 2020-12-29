import {SceneManager} from "../manager/scene/SceneManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class LoginScene extends cc.Component{
    protected onLoad(): void {
        SceneManager.instance().changeScene("loginScene");
    }
}