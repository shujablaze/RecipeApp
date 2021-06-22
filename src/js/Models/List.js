import uniqid from 'uniqid'; 

export default class List{
    constructor(){
        this.items=[];
    }
    //Creates an item to be inserted into list
    addItem(count,unit,ingredient){
        const item={
            id:uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }
    //Removes item from items array
    deleteItem(id){
        const index=this.items.findIndex(el=>el.id===id);
        this.items.splice(index,1);
    }
    //updates count in items array
    updateCount(id,newCount){
        this.items.find(el=>el.id===id).count=newCount;
    }
}