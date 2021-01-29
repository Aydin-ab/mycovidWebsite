import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { Article } from '../article.model';
import { Country } from '../country.model';
import { MycovidService } from '../mycovid.service';
import { User } from '../user.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  date: any;
  country!: Country;
  text!: string;
  totalCase!: number;
  recoveryRate!: number;
  mortalityRate!: number;
  user!: User | null;
  articles!: Article[];

  // For pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], 'Active Cases'];
  public pieChartData!: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  http: any;

  constructor(public mycovidService: MycovidService) { }

  ngOnInit(): void {

    this.user = this.mycovidService.getUser();

      
    this.country = this.mycovidService.getCountry();
    this.totalCase = this.country.totalConfirmed + this.country.totalDeaths + this.country.totalRecovered;
    this.recoveryRate = Number((100*this.country.totalRecovered / this.totalCase).toFixed(2))
    this.mortalityRate = Number((100*this.country.totalDeaths / this.totalCase).toFixed(2))
    this.pieChartData = [this.mortalityRate, this.recoveryRate, 100*this.country.totalConfirmed/this.totalCase];

  }


  // For bar chart
  private dataWeek: any= []; // api data (week)
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels!: string[] | void[];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData!: { data: number[]; label: string; }[];


  createBarChart() {

    const urlBar ='https://corona.lmao.ninja/v2/historical/all?lastdays=8'
    
    this.http.get(urlBar).subscribe((res: any)=>{
    
      this.dataWeek = res;
      this.barChartLabels =  Object.keys(this.dataWeek["cases"]);
      this.barChartLabels.shift();
      var deathsArray:number[] = [];
      var recoveredArray:number[] = [];
      var casesArray:number[] = [];      

      for (let i = 1; i < 8; i++) {

        const deathsAfter: any = Object.values(this.dataWeek["deaths"])[i];
        const deathsBefore: any = Object.values(this.dataWeek["deaths"])[i-1];
        const recoveredAfter: any = Object.values(this.dataWeek["recovered"])[i];
        const recoveredBefore: any = Object.values(this.dataWeek["recovered"])[i-1];
        const casesAfter: any = Object.values(this.dataWeek["cases"])[i];
        const casesBefore: any = Object.values(this.dataWeek["cases"])[i-1];

        deathsArray.push(deathsAfter - deathsBefore);
        recoveredArray.push(recoveredAfter - recoveredBefore);
        casesArray.push(casesAfter - casesBefore);


      }
      this.barChartData = [
        {data: deathsArray, label: 'Daily Deaths'},
        {data: recoveredArray, label: 'Daily Recovered'},
        {data: casesArray, label: 'Daily New Cases'}
      ];

    })

  }
  

  formatNumber(num: { toString: () => string; }) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }


}
