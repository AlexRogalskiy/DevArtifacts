import {Injectable, EventEmitter} from '@angular/core';
import {Recipe} from "./recipe";
import {Ingredient} from "../shared/ingredient";
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class RecipeService {

  recipesChanged = new EventEmitter<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe('Schnitzel',
      'Very tasty',
      'http://www.daringgourmet.com/wp-content/uploads/2014/03/Schnitzel-7_edited.jpg', [
        new Ingredient('French Fries', 2),
        new Ingredient('Pork Meat', 1)
      ]),
    new Recipe('Summer Salad', 'Okayish', 'http://cookdiary.net/wp-content/uploads/images/Summer-Salad_17782.jpg', []),
    new Recipe('Hákarl', 'Terrible', 'http://andrewzimmern.com/wp-content/uploads/2015/10/Hakarl-Iceland.jpg', [])
  ];

  private recipesURL: string = 'https://recipebook-69610.firebaseio.com/recipes.json';

  constructor(private  http: Http) { }

  getRecipes() {
    return this.recipes;
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  deleteRecipe(recipe: Recipe) {
    this.recipes.splice(this.recipes.indexOf(recipe), 1);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

  editRecipe(oldRecipe: Recipe, newRecipe: Recipe) {
    this.recipes[this.recipes.indexOf(oldRecipe)] = newRecipe;
  }

  storeData() {
    const body = JSON.stringify(this.recipes);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put(this.recipesURL, body, {headers: headers});
  }

  fetchData() {
    return this.http.get(this.recipesURL)
      .map((response: Response) => response.json())
      .subscribe(
        (data: Recipe[]) => {
          this.recipes = data;
          this.recipesChanged.emit(this.recipes);
        }
      );
  }
}
