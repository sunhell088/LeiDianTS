export class GameEvent {
    //点击重新开始按钮
    public static RESTART_GAME:string = "RESTART_GAME";
    //战机死亡
    public static GAME_OVER:string = "GAME_OVER";
    public static MOVE_BG:string = "MOVE_BG";
    //敌机被杀死
    public static KILL_ENEMY:string = "KILL_ENEMY";
    //战机在有护盾情况下受伤
    public static PROTECT_EFFECT:string = "PROTECT_EFFECT";
    //距离等级刷新
    public static UPDATE_DISTANCE_STAGE:string = "UPDATE_DISTANCE_STAGE";
    //金币碰到玩家
    public static ITEM_COLLISION_PLAYER:string = "ITEM_COLLISION_PLAYER";
    //陨石碰到玩家
    public static ROCK_COLLISION_PLAYER:string = "ROCK_COLLISION_PLAYER";
    //子弹击中敌机
    public static BULLET_HIT_ENEMY:string = "BULLET_HIT_ENEMY";
    //功能道具飘出结束
    public static EAT_ITEM:string = "EAT_ITEM";
    //开始冲刺（已经在冲刺中）
    public static SPURT_DURATION:string = "SPURT_DURATION";
    //碰到吸铁石区域了
    public static COLLIDER_MAGNET:string = "COLLIDER_MAGNET";
    //更新子弹商店界面
    public static UPDATE_STORE_BULLET:string = "UPDATE_STORE_BULLET";
    //飘提示文字
    public static FLY_NOTICE:string = "FLY_NOTICE";
    //金币增加
    public static UPDATE_FIGHT_GOLD:string = "UPDATE_FIGHT_GOLD";
    //buff时间减少
    public static DEDUCT_BUFF_TIME:string = "DEDUCT_BUFF_TIME";
    //刷新商城金币
    public static UPDATE_STORE_GOLD:string = "UPDATE_STORE_GOLD";
    //聚焦某个类型飞机
    public static FOCUS_ENEMY:string = "FOCUS_ENEMY";
    //聚焦某个类型道具
    public static FOCUS_ITEM:string = "FOCUS_ITEM";
    //打开双击使用炸弹ui
    public static OPEN_DOUBLE_CLICK_HINT:string = "OPEN_DOUBLE_CLICK_HINT";
    //双击 提示（双击使用炸弹）
    public static DOUBLE_CLICK_HINT_DO:string = "DOUBLE_CLICK_HINT_DO";
    //使用指定飞机
    public static USE_PLANE:string = "USE_PLANE";
    //购买指定飞机
    public static BUY_PLANE:string = "BUY_PLANE";
    //使用炸弹
    public static USE_BOMB_EFFECT:string = "USE_BOMB_EFFECT";


}