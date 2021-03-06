import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { newsApiArticle } from '../interfaces/newsApiArticle';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  newsApiLink: string = "https://newsapi.org/v2";
  databaseLink: string = "https://localhost:44359";

  headers = new HttpHeaders({
    'Authorization': 'a4c8252f9d4e4363ad90a43090be172b'
  })

  public GetArticlesFromApiTopHeadlines(): Observable<newsApiArticle[]> {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.get<newsApiArticle[]>(this.newsApiLink + "/top-headlines?country=nl", requestOptions).pipe(
      map(result => result["articles"])
    );
  }

  public GetArticlesFromApiTopHeadlinesFromCountry(countryCode: string): Observable<newsApiArticle[]> {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.get<newsApiArticle[]>(this.newsApiLink + "/top-headlines?country=" + countryCode, requestOptions)
      .pipe(
        map(result => result["articles"])
      );
  }

  public GetArticlesFromApiFilterContent(content: string): Observable<newsApiArticle[]> {
    const requestOptions = {
      headers: this.headers
    };
    return this.http.get<newsApiArticle[]>(this.newsApiLink + "/top-headlines?q=" + content, requestOptions).pipe(
      map(result => result["articles"])
    );
  }

  public PostArticlesToDatabase(articles: newsApiArticle[]) {
    return this.http.post(this.databaseLink + "/article/publishArticles", articles, { responseType: 'text' });
  }
}
