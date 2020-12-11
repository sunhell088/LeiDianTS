export class PlaneConfig {
    public static levelExp:number[] = [0,60,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150];

    public static planeConfig:any[] = [
        {
            id: 1,
            name: "虚空之眼",
            textureName: "#ui_role_head0.png",
            fightTextureName: "role0",
            levelUpTextureName: "#levelup1.png",
            bigPngName: 0,
            bulletType: "1",
            bombType: "1_35",
            price: 0,
            planeFunction:function(shipSprite){},
        },
        {
            id: 2,//磁铁（且双倍金币-金币变大）
            name: "黑暗元首",
            textureName: "#ui_role_head1.png",
            fightTextureName: "role1",
            levelUpTextureName: "#levelup2.png",
            bigPngName: 1,
            bulletType: "bullet3",
            bombType: "bullet3_35",
            price: 5000,
            //磁铁（且双倍金币-金币变大）
            planeFunction:function(shipSprite){
                shipSprite.setMagnet(true);
            },
        },
        {
            id: 4,//自带双倍火力
            name: "战争之王",
            textureName: "#ui_role_head2.png",
            fightTextureName: "role2",
            levelUpTextureName: "#levelup3.png",
            bigPngName: 2,
            bulletType: "bullet5",
            bombType: "bullet5_35",
            price: 10000,
            //自带双倍火力
            planeFunction:function(shipSprite){
                shipSprite._doubleFire = true;
            },
        }
    ];
}