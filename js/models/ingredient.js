export class Ingredient {
  constructor(name, mixTime, speed, color, structure) {
    this.name = name;
    this.mixTime = parseInt(mixTime, 10);
    this.speed = parseInt(speed, 10);
    this.color = color;
    this.structure = structure;
  }
}
