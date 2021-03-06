export class CommonConfig {
    //背景音乐开关
    public static MUSIC = true;
    //音效开关
    public static EFFECT = true;
    public static WIDTH = 320;
    public static HEIGHT = 568;

    //道具飘动速度
    public static ITEM_FLY_SPEED = 100;
    //子弹速度
    public static BULLET_SPEED = 1500;
    //敌机速度
    public static ENEMY_SPEED = 300*0.8;
    //停留敌机速度
    public static SMALL_BOSS_SPEED = 100;
    //boss敌机最后冲刺速度
    public static BIG_BOSS_SPEED = 500;
    //小boss敌机停留时间
    public static SMALL_BOSS_STAYTIME = 3;
    //boss敌机停留时间
    public static BIG_BOSS_STAYTIME = 6;

    //冲刺中敌机速度
    public static ENEMY_SPURT_SPEED = 640;
    //陨石速度
    public static ROCK_SPEED = 420;
    //陨石跟踪速度
    public static ROCK_FOLLOW_SPEED = 40;
    //炸弹飞行时间
    public static ROCK_BOMB_SPEED = 1;
    //追踪飞机的速度
    public static FOLLOW_ENEMY_SPEED = 500/1.5;

    //子弹产生间隔
    public static BULLET_DELAY = 0.03;
    //每秒子弹数目
    public static BULLET_COUNT_PER = 1/CommonConfig.BULLET_DELAY;
    //产生飞机的间隔
    public static ENEMY_DELAY = 2;
    //产生陨石的间隔
    public static ROCK_CONFIG_DELAY = 11;
    //产生炸弹飞机的间隔
    public static BLESS_BOMB_DELAY = 13;
    //产生福利飞机的间隔
    public static BLESS_PLANE_DELAY = 10;
    //产生特殊停留飞机的间隔
    public static STAY_ENEMY_DELAY = 30;
    //产生特殊追踪飞机的间隔
    public static FOLLOW_ENEMY_DELAY = 15;
    //产生冲刺敌机的间隔
    public static ENEMY_SPURT_DELAY = 0.3;
    //同一批陨石出现的间隔时间
    public static ROCK_DELAY = 0.4*2;
    //冲刺持续时间
    public static SPURT_DURATION = 2.5;

    //背景移动速度
    public static BG_SPEED = 50;
    //冲刺背景移动速度
    public static BG_SPURT_SPEED = 650;
    //普通速度每秒飞行多少米
    public static DISTANCE_SPEED = 32;
    //冲刺速度每秒飞行多少米
    public static DISTANCE_SPURT_SPEED = 128;

    //敌机的宽和高
    public static ENEMY_WIDTH = 60;
    public static ENEMY_HEIGHT = 60;

    //多少米后才刷新记录时，才出现新记录图片
    public static NEW_RECORD_DISTANCE = 50;
    //飞行距离对应的难度等级
    public static DISTANCE_STAGE_UNIT = 500;

    //-------------------
    public static PRESET_COUNT_BOMB = 10;

    //吸铁石时间
    public static MAGNET_TIME = 15;
    //护盾时间
    public static PROTECT_TIME = 15;
    //双倍火力时间
    public static DOUBLE_FIRE_TIME = 15;
    //影子时间10秒（*10解决小数点精度问题）
    public static SHADOW_TIME = 150;
    //最大距离
    public static MAX_DISTANCE:number = 10000;
    //自动合成的最大时间
    public static AUTO_COMBINE_MAX_TIME:number = 30;
    //最大携带炸弹数量
    public static BOMB_MAX_COUNT:number = 4;
}