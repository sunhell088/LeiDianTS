export enum FLY_STATE{
    ENTER=0,
    RUN=1,
    EXIT=2
}

//0为全部清理，1为只清理岩石，2为只清理敌机，3为自爆飞机爆炸（只清理普通敌机）
export enum CLEAN_TYPE{
    ALL=0,
    ROCK=1,
    ENEMY=2,
    ENEMY_WITHOUT_SPECIAL=3
}