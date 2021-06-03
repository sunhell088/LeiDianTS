import {SceneManager} from "../manager/scene/SceneManager";
import {GuideManager} from "../manager/guide/GuideManager";
import {CommonConfig} from "../configs/CommonConfig";
import {GameUtil} from "../common/GameUtil";
import {SoundConfig} from "../configs/SoundConfig";
import {CommonUtil} from "../common/CommonUtil";
import {FormationConfig} from "../configs/FormationConfig";
import {ConfigUtil} from "../common/ConfigUtil";
import {Player} from "../classes/Player";

const {ccclass, property} = cc._decorator;
@ccclass
export default class LoginScene extends cc.Component{
    protected onLoad(): void {
        SceneManager.instance().changeScene("loginScene");

        //开启碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        CommonConfig.WIDTH = this.node.width;
        CommonConfig.HEIGHT = this.node.height;
        GameUtil.playMusic(SoundConfig.mainMusic_mp3+""+CommonUtil.random(0,2));
        //因为transformToPixel会把相对标识改为绝对坐标
        if(!(FormationConfig.formationConfig[0][0] instanceof cc.Vec2)){
            FormationConfig.formationConfig = ConfigUtil.transformToPixel(CommonConfig.ENEMY_WIDTH, CommonConfig.ENEMY_HEIGHT,
                FormationConfig.formationConfig)
        }
        Player.player = new Player();
        Player.player.loadData();
    }
}