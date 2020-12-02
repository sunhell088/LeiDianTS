export class GameEvent {
    public static ADD_BOMB:string = "onAddBomb";
    public static ADD_EXP:string = "onAddExp";
    public static UP_GRADE:string = "onUpGrade";
    public static USE_BOMB:string = "onUseBomb";
    public static ADD_CURRENT_REWARD_GOLD:string = "onAddCurrentRewardGold";

    public static SPURT_ACTION:string = "onSpurtAction";
    public static DOUBLE_FIRE_ACTION:string = "onDoubleFireAction";
    public static XTS_ACTION:string = "onXTSAction";
    public static EAT_ITEM:string = "onEatItem";

    //复活
    public static STORE_REVIVE:string = "onStoreRevive";
    public static STORE_SPURT:string = "onStoreSpurt";
    public static STORE_DEATH:string = "onStoreDeath";
    public static STORE_CHANGE_PLANE:string = "onStoreChangePlane";

    public static MOVE_BG:string = "onMoveBG";
    public static NEW_RECORD:string = "onNewRecord";
}