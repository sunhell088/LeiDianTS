export class GameEvent {
    public static SET_CURRENT_REWARD_GOLD:string = "SET_CURRENT_REWARD_GOLD";

    public static USE_STORE_ITEM:string = "USE_STORE_ITEM";
    public static USE_FIGHT_DROP_ITEM:string = "USE_FIGHT_DROP_ITEM";


    public static RESTART_GAME:string = "RESTART_GAME";
    public static GAME_OVER:string = "GAME_OVER";

    public static MOVE_BG:string = "MOVE_BG";

    public static KILL_ENEMY:string = "KILL_ENEMY";
    public static PROTECT_EFFECT:string = "PROTECT_EFFECT";
    //距离等级刷新
    public static UPDATE_DISTANCE_STAGE:string = "UPDATE_DISTANCE_STAGE";
    //金币碰到玩家
    public static ITEM_COLLISION_PLAYER:string = "ITEM_COLLISION_PLAYER";
    //陨石碰到玩家
    public static ROCK_COLLISION_PLAYER:string = "ROCK_COLLISION_PLAYER";
    //复活甲
    public static STORE_ITEM_EFFECT:string = "STORE_ITEM_EFFECT";

    //子弹击中敌机
    public static BULLET_HIT_ENEMY:string = "BULLET_HIT_ENEMY";

    //功能道具飘出结束
    public static EAT_ITEM:string = "EAT_ITEM";

    //开始冲刺（已经在冲刺中）
    public static SPURT_DURATION:string = "SPURT_DURATION";

    //碰到吸铁石区域了
    public static COLLIDER_MAGNET:string = "COLLIDER_MAGNET";

}