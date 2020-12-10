export class GameEvent {
    public static SET_BOMB:string = "onSetBomb";
    public static ADD_EXP:string = "onAddExp";
    public static UP_GRADE:string = "onUpGrade";
    public static SET_CURRENT_REWARD_GOLD:string = "onSetCurrentRewardGold";

    public static USE_STORE_ITEM:string = "onUseStoreItem";
    public static USE_FIGHT_DROP_ITEM:string = "onUseFightDropItem";

    public static USE_BOMB:string = "onUseBomb";

    public static RESTART_GAME:string = "onRestartGame";
    public static GAME_OVER:string = "onGameOver";

    public static MOVE_BG:string = "onMoveBG";

    public static DOUBLE_CLICK:string = "onDoubleClick";

    public static KILL_ENEMY:string = "onKillEnemy";
    public static CHANGE_PLANE:string = "onChangePlane";
    public static PROTECT_EFFECT:string = "onProtectEffect";

    //金币碰到玩家
    public static ITEM_COLLISION_PLAYER:string = "onItemCollisionPlayer";
    //陨石碰到玩家
    public static ROCK_COLLISION_PLAYER:string = "onRockCollisionPlayer";
    //复活甲
    public static STORE_ITEM_EFFECT:string = "onStoreItemEffect"
}