import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searchTerms= new Subject<string>();

  constructor(
    private heroService:HeroService,
  ) { }

  ngOnInit() {
    this.heroes$=this.searchTerms.pipe(
      // 연속된 키입력을 처리하기 위해 300ms 대기
      debounceTime(1000),
      // 이전에 입력한 검색어와 같으면 무시
      distinctUntilChanged(),
      // 검색어가 변경되면 새로운 옵저버블을 생성
      switchMap((term:string)=> this.heroService.searchHeroes(term)),
    );
  }

  search(term:string):void{
    this.searchTerms.next(term);
  }

}
