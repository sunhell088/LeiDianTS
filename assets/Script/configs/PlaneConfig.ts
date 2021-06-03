import ShipSprite from "../sprites/ShipSprite";
import {Player} from "../classes/Player";

export class PlaneConfig {

    public static planeConfig:any[] = [
        {
            id: 1,
            name: "一架普通战机",
            textureName: "ui_role_head0",
            fightTextureName: "role0",
            levelUpTextureName: "#levelup1.png",
            nameIndex: 0,
            bulletType: "1",
            bombType: "1_35",
            price: 0,
            planeFunction:function(shipSprite){},
        },
        {
            id: 2,//磁铁
            name: "自带磁石",
            textureName: "ui_role_head1",
            fightTextureName: "role1",
            levelUpTextureName: "#levelup2.png",
            nameIndex: 1,
            bulletType: "bullet3",
            bombType: "bullet3_35",
            price: 50000,
            //磁铁
            planeFunction:function(shipSprite:ShipSprite){
                Player.player._magnet = true;
            },
        },
        {
            id: 4,//自带影子
            name: "自带磁石和一个影子",
            textureName: "ui_role_head2",
            fightTextureName: "role2",
            levelUpTextureName: "#levelup3.png",
            nameIndex: 2,
            bulletType: "bullet5",
            bombType: "bullet5_35",
            price: 500000,
            planeFunction:function(shipSprite:ShipSprite){
                // Player.player._magnet = true;
                Player.player._shadowFire = true;
            },
        }
    ];
}