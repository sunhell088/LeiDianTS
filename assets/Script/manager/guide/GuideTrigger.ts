export class GuideTriggerItemAppear {
    private readonly itemName:number = null;
    constructor(itemName:number) {
        this.itemName = itemName;
    }
    checkTrigger(itemName:number):boolean {
        return itemName==this.itemName
    }

}