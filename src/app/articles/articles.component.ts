import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { MycovidService } from '../mycovid.service';
import { User } from '../user.model';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  user!: User;
  articles!: Article[];
  date: any;
  country!: string | undefined;
  description!: string | undefined;

  constructor(public mycovidService: MycovidService) { }

  ngOnInit(): void {

    this.user = this.mycovidService.getUser()!;
    this.mycovidService
        .getArticles()
        .subscribe((res: any) => {

          var art: Article[];
          art = res;
          this.articles = art.sort( (a,b) => (a.date < b.date) ? 1 : -1 );

        });

  }

  addArticle()  {

    let article: Article = {

      date: new Date(this.date),
      country: this.country!,
      description: this.description!

    };

    this.mycovidService.addArticle(article);
    this.date = undefined;
    this.country = undefined;
    this.description = undefined;

  }

}
