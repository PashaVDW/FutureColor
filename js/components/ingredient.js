export class Ingredient {
    constructor(naam, mengtijd, snelheid, kleur, structuur) {
      this.naam = naam;
      this.mengtijd = parseInt(mengtijd, 10);
      this.snelheid = parseInt(snelheid, 10);
      this.kleur = kleur;
      this.structuur = structuur;
    }
  }
  