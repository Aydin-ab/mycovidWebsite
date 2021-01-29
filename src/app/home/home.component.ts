import { Component, OnInit } from '@angular/core';
import { MycovidService } from '../mycovid.service';
import { User } from '../user.model';
import { Article } from '../article.model';
// For API retrieval
import { HttpClient } from "@angular/common/http";
// For pie chart
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user!: User | null;
  articles!: Article[];

  // For first table and pie chart
  public dataGlobal: any= []; // api data (summary)
  totalCase!: number;
  recoveryRate!: number;
  mortalityRate!: number;




  
  // For last table
  public dataCountries: any= []; // api data (summary : Countries)
  
  

  constructor(public mycovidService: MycovidService, private http: HttpClient) { }

  ngOnInit(): void {
  
    this.user = this.mycovidService.getUser();

 
    this.mycovidService.getData(0);
    this.mycovidService.createBarChart();
    this.mycovidService.createLineChart()
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();

  }
  

  formatNumber(num: { toString: () => string; }) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  

}

