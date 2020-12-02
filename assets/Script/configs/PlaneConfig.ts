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
            bombType: "#1_35.png",
            planeFunction: function (shipSprite) {
            },
            price: 0
        },
        {
            id: 2,
            name: "黑暗元首",
            textureName: "#ui_role_head1.png",
            fightTextureName: "role1",
            levelUpTextureName: "#levelup2.png",
            bigPngName: 1,
            bulletType: "bullet3",
            bombType: "#bullet3_35.png",
            //磁铁（且双倍金币-金币变大）
            planeFunction: function (shipSprite) {
                shipSprite.setMagnet(true);
            },
            price: 5000
        },
        {
            id: 4,
            name: "战争之王",
            textureName: "#ui_role_head2.png",
            fightTextureName: "role2",
            levelUpTextureName: "#levelup3.png",
            bigPngName: 2,
            bulletType: "bullet5",
            bombType: "#bullet5_35.png",
            //自带双倍火力
            planeFunction: function (shipSprite) {
                shipSprite._doubleFire = true;
            },
            price: 10000
        }
    ];

    public static getPlaneConfig(planeID){
        for(let p in PlaneConfig.planeConfig){
            if(PlaneConfig.planeConfig[p].id == planeID){
                return PlaneConfig.planeConfig[p];
            }
        }
        return null;
    };

    //获得指定等级升到下一级需要的经验（如：1级升2级所需要的经验，参数为1）
    public static getExpByLevel(level):number{
        if(level<0 || level>=PlaneConfig.levelExp.length) return -1;
        return PlaneConfig.levelExp[level];
    };
}