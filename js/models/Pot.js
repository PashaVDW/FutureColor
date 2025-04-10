export class Pot {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.contents = []; 
    }
  
    canAdd(ingredient) {
      if (this.contents.length === 0) return true;
      return this.contents[0].speed === ingredient.speed;
    }
  
    addIngredient(ingredient) {
      if (this.canAdd(ingredient)) {
        this.contents.push(ingredient);
        return true;
      }
      return false;
    }
  }
  