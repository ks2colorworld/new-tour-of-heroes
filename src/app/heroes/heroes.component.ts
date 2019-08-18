import { Component, OnInit } from '@angular/core';
import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  constructor(
    private heroService:HeroService
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  // hero = 'Windstorm';
  heroes: Hero[];//= HEROES;

/*//불필요한 코드
  hero: Hero = {
    id: 1,
    name: 'Windstorm',
  }
  selectedHero: Hero;

  onSelect(hero:Hero): void{
    this.selectedHero = hero;
  }
 */

  getHeroes(): void{
    // this.heroes = this.heroService.getHeroes();
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes); //옵저버블 구독하기로 코드 변경
  }

  add(name: string): void {
    // let newHeroes: Hero[] = this.heroes; //test code
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
