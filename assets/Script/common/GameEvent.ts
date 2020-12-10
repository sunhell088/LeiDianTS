export class GameEvent {
    public static SET_BOMB:string = "SET_BOMB";
    public static ADD_EXP:string = "ADD_EXP";
    public static UP_GRADE:string = "UP_GRADE";
    public static SET_CURRENT_REWARD_GOLD:string = "SET_CURRENT_REWARD_GOLD";

    public static USE_STORE_ITEM:string = "USE_STORE_ITEM";
    public static USE_FIGHT_DROP_ITEM:string = "USE_FIGHT_DROP_ITEM";

    public static USE_BOMB:string = "USE_BOMB";

    public static RESTART_GAME:string = "RESTART_GAME";
    public static GAME_OVER:string = "GAME_OVER";

    public static MOVE_BG:string = "MOVE_BG";

    public static DOUBLE_CLICK:string = "DOUBLE_CLICK";

    public static KILL_ENEMY:string = "KILL_ENEMY";
    public static CHANGE_PLANE:string = "CHANGE_PLANE";
    public static PROTECT_EFFECT:string = "PROTECT_EFFECT";

    //金币碰到玩家
    public static ITEM_COLLISION_PLAYER:string = "ITEM_COLLISION_PLAYER";
    //陨石碰到玩家
    public static ROCK_COLLISION_PLAYER:string = "ROCK_COLLISION_PLAYER";
    //复活甲
    public static STORE_ITEM_EFFECT:string = "STORE_ITEM_EFFECT"
}