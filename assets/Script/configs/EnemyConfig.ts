import EnemySprite from "../sprites/enemy/EnemySprite";
import FollowEnemySprite from "../sprites/enemy/FollowEnemySprite";
import FlexEnemySprite from "../sprites/enemy/FlexEnemySprite";
import BossEnemySprite from "../sprites/enemy/BossEnemySprite";
import StayEnemySprite from "../sprites/enemy/StayEnemySprite";


export class EnemyConfig {

    public static enemyConfig:any = {
        enemy0:{
            id:"enemy0",
            textureName:"enemy0",
            enterGamePreset:true,
            classType:"EnemySprite"
        },
        enemy1:{
            id:"enemy1",
            textureName:"enemy1",
            classType:"EnemySprite"
        },
        enemy2:{
            id:"enemy2",
            textureName:"enemy2",
            classType:"EnemySprite"
        },
        enemy3:{
            id:"enemy3",
            textureName:"enemy3",
            classType:"EnemySprite"
        },
        enemy4:{
            id:"enemy4",
            textureName:"enemy4",
            classType:"EnemySprite"
        },
        enemy5:{
            id:"enemy5",
            textureName:"enemy5",
            classType:"EnemySprite"
        },
        enemy6:{
            id:"enemy6",
            textureName:"enemy6",
            classType:"EnemySprite"
        },
        enemy7:{
            id:"enemy7",
            textureName:"enemy7",
            classType:"EnemySprite"
        },
        enemy8:{
            id:"enemy8",
            textureName:"enemy8",
            classType:"EnemySprite"
        },
        enemy9:{
            id:"enemy9",
            textureName:"enemy9",
            classType:"EnemySprite"
        },
        //------------------特殊飞机---------------------------
        //自爆飞机
        enemyBomb:{
            id:"enemyBomb",
            textureName:"enemy20",
            classType:"StayEnemySprite"
        },
        //宝箱飞机
        enemyBox:{
            id:"enemyBox",
            textureName:"enemy21",
            classType:"FlexEnemySprite"
        },
        //追踪飞机
        enemyFollow:{
            id:"enemyFollow",
            textureName:"enemy27",
            classType:"FollowEnemySprite"
        },
        //停留飞机
        enemyStay1:{
            id:"enemyStay1",
            textureName:"enemy22",
            classType:"StayEnemySprite"
        },
        //停留大飞机2
        enemyStay2:{
            id:"enemyStay2",
            textureName:"enemy26",
            classType:"StayEnemySprite"
        },
        //boss1
        enemyBoss1:{
            id:"enemyBoss1",
            textureName:"enemy23",
            classType:"BossEnemySprite"
        },
        //boss2
        enemyBoss2:{
            id:"enemyBoss2",
            textureName:"enemy24",
            classType:"BossEnemySprite"
        },
        //boss3
        enemyBoss3:{
            id:"enemyBoss3",
            textureName:"enemy25",
            classType:"BossEnemySprite"
        }
    };
}