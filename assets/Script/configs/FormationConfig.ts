import {CommonConfig} from "./CommonConfig";

export class FormationConfig {
    public static formationConfig:any = [
        [10,11,12,13,14],     // 一
        [0,6,12,18,24],       // \
        [20,16,12,8,4],       // /
        [0,6,12,8,4],       // V
        [20,16,12,18,24],      // 倒V
        [0,11,12,13,4],       // U
        [20,11,12,13,24],     // 倒U
        [0,11,2,13,4],        // W
        [20,11,22,13,24]        // M
    ];

    public static transformToPixel(width, height, formationConfig):any{
        for(var p=0;p<formationConfig.length;p++){
            var property = formationConfig[p];
            if(!(property instanceof Array)) continue;
            var pixelArray = [];
            for(var i=0; i<property.length; i++){
                var tag = property[i];
                var x = 0, y = 0;
                if(tag>=0&&tag<=4){
                    y = height;
                }else if(tag>=5&&tag<=9){
                    y = height/2;
                }else if(tag>=10&&tag<=14){
                    y = 0;
                }else if(tag>=15&&tag<=19){
                    y = -height/2;
                }else if(tag>=20&&tag<=24){
                    y = -height;
                }

                var widthUnit = CommonConfig.WIDTH/10;
                if(tag%5 == 0){
                    x = widthUnit*1;
                }else if(tag%5 == 1){
                    x = widthUnit*3;
                }else if(tag%5 == 2){
                    x = widthUnit*5;
                }else if(tag%5 == 3){
                    x = widthUnit*7;
                }else if(tag%5 == 4){
                    x = widthUnit*9;
                }
                x -= CommonConfig.WIDTH/2;

                pixelArray.push(new cc.Vec2(x, y));
            }
            formationConfig[p] = pixelArray;
        }
        return formationConfig;
    }
}