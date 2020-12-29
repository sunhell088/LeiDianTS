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
    //使用炸弹
    public static USE_BOMB_EFFECT:string = "USE_BOMB_EFFECT";
    //------------------新手指引-------------------------
    //登场
    public static GUIDE_TRIGGER_COME_ON_STAGE:string = "GUIDE_TRIGGER_COME_ON_STAGE";
    //物品爆出
    public static ITEM_DROP:string = "ITEM_DROP";
    //特殊敌机出现
    public static SPECIAL_ENEMY_APPEAR:string = "SPECIAL_ENEMY_APPEAR";
    //聚焦某个节点对象
    public static GUIDE_FOCUS_ENEMY:string = "GUIDE_FOCUS_ENEMY";

}