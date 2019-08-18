import { HEROES } from './mock-heroes';
import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import { Observable, of } from "rxjs";
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'//app.modules.ts >> provided 에 코드 추가할 필요 없음.
})

export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  private heroesUrl = 'api/heroes';

  searchHeroes(term:string): Observable<Hero[]>{
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

/** POST: 서버에 새로운 히어로를 추가합니다. */
addHero (hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}

deleteHero(hero:Hero|number): Observable<Hero> {
  const id = typeof hero === 'number'?hero:hero.id;
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<Hero>(url, httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  )
}

  getHeroes(): Observable<Hero[]>{//Hero[]{
    // TODO: 메시지는 히어로 데이터를 가져온 _후에_ 보내야 합니다.
    // this.messageService.add('HeroService: heroes 데이터를 가져왔습니다.');
    // return of(HEROES);//HEROES;
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('heroes 데이터를 가져왔습니다.')),
        catchError(this.handleError<Hero[]>('getHeroes',[]))
      );
    }

  /** GET: id에 해당하는 히어로 데이터를 가져옵니다. 존재하지 않으면 `undefined`를 반환합니다. */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // 배열에 있는 항목 중 하나만 반환합니다.
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  getHero(id: number): Observable<Hero>{
    // this.messageService.add(`HeroService: hero id=${id} 정보 로드완료`);
    // return of(HEROES.find(hero => hero.id === id));

    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`hero id=${id} 정보 로드완료`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
  }

  /** PUT: 서버에 저장된 히어로 데이터를 변경합니다. */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * HTTP 요청이 실패한 경우를 처리합니다.
   * 애플리케이션 로직 흐름은 그대로 유지합니다.
   * @param operation - 실패한 동작의 이름
   * @param result - 기본값으로 반환할 객체
   */
  private handleError<T> (operation: string, result?: T){
    return (error: any): Observable<T> => {

      // TODO: 리모트 서버로 에러 메시지 보내기
      console.error(error); // 지금은 콘솔에 로그를 출력
      this.log(`${operation} failed: ${error.message}`);

      // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환
      return of(result as T);
    }
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

}
