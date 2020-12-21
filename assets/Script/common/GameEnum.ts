export enum FLY_STATE{
    ENTER=0,
    RUN=1,
    EXIT=2
}

//0为全部清理，1为只清理岩石，2为只清理敌机
export enum CLEAN_TYPE{
    ALL=0,
    ROCK=1,
    ENEMY=2
}

//购买子弹
export enum BUY_BULLET_STATE{
    OK=0,
    NO_MONEY=1,
    NO_GRID=2
}