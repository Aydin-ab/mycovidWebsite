import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { runInThisContext } from 'vm';
import { Article } from './article.model';
import { HttpClient } from '@angular/common/http';
import { Country } from './country.model';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
@Injectable({
  providedIn: 'root'
})
export class MycovidService {

  private user!: User | null;
  public dataCountries: any= []; // api data (summary.Countries)
  public dataGlobal: any= []; // api data (summary)
  totalCase!: number;
  recoveryRate!: number;
  mortalityRate!: number;

  // For pie chart in home page
  // For pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], 'Active Cases'];
  public pieChartData!: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  
  // For bar chart in home page
  private dataWeek: any= []; // new api data (week)
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels!: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData!: { data: number[]; label: string; }[];
  

  // For Line Chart
  private dataMonth: any= []; // api data (week)
  chartLineOptions = {
    responsive: true
  };
  public chartLineData!: ChartDataSets[];
  public chartLineLabels!:  string[];



  constructor(private afAuth: AngularFireAuth, 
              private router: Router,
              private firestore: AngularFirestore,
              private http: HttpClient) { }

  async signInWithGoogle(){

    const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
    this.user = {
      uid: credientals.user!.uid,
      displayName: credientals.user!.displayName!,
      email: credientals.user!.email!,
      isEligible: true
    };
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    this.router.navigate(["home"]);

  }

  private updateUserData(){

    this.firestore.collection("users")
                  .doc(this.user!.uid!)
                  .set({
                    uid: this.user!.uid,
                    displayName: this.user!.displayName,
                    email: this.user!.email,
                  }, {merge: true});

  }

  getUser(){
    if (this.user == null && this.userSignedIn()) {

      this.user = JSON.parse(localStorage.getItem("user")!);

    }
    return this.user;

  }

  userSignedIn(): boolean{

    return JSON.parse(localStorage.getItem("user")!) != null;

  }

  signOut(){

    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);

  }

  getArticles(){

    return this.firestore.collection("articles").valueChanges();

  }

  addArticle(article: Article) {

    this.firestore.collection("articles")
                  .add(article);
    

  }

  getData(sort: number){
    const url ='https://api.covid19api.com/summary'
    if (sort == 0) { // Default
        this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.totalCase = this.dataGlobal.Global.TotalConfirmed + this.dataGlobal.Global.TotalDeaths + this.dataGlobal.Global.TotalRecovered;
        this.recoveryRate = Number((100*this.dataGlobal.Global.TotalRecovered / this.totalCase).toFixed(2))
        this.mortalityRate = Number((100*this.dataGlobal.Global.TotalDeaths / this.totalCase).toFixed(2))
        this.dataCountries = this.dataGlobal.Countries;
        this.createPieChart();
      })
    }
    else if (sort == 1) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort( (a: { Country: any; },b: { Country: string; }) => b.Country.localeCompare(a.Country) );
      })

    }
    else if (sort == 2) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { NewConfirmed: number; },b: { NewConfirmed: number; }) => (a.NewConfirmed - b.NewConfirmed));
      })

    }
    else if (sort == 3) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { NewConfirmed: number; },b: { NewConfirmed: number; }) => (b.NewConfirmed - a.NewConfirmed));
      })

    }
    else if (sort == 4) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { TotalConfirmed: number; },b: { TotalConfirmed: number; }) => (a.TotalConfirmed - b.TotalConfirmed));
      })

    }
    else if (sort == 5) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { TotalConfirmed: number; },b: { TotalConfirmed: number; }) => (b.TotalConfirmed - a.TotalConfirmed));
      })

    }
    else if (sort == 6) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { NewRecovered: number; },b: { NewRecovered: number; }) => (a.NewRecovered - b.NewRecovered));
      })

    }
    else if (sort == 7) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { NewRecovered: number; },b: { NewRecovered: number; }) => (b.NewRecovered - a.NewRecovered));
      })

    }
    else if (sort == 8) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { TotalRecovered: number; },b: { TotalRecovered: number; }) => (a.TotalRecovered - b.TotalRecovered));
      })

    }
    else if (sort == 9) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { TotalRecovered: number; },b: { TotalRecovered: number; }) => (b.TotalRecovered - a.TotalRecovered));
      })

    }
    else if (sort == 10) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { NewDeaths: number; },b: { NewDeaths: number; }) => (a.NewDeaths - b.NewDeaths));
      })

    }
    else if (sort == 11) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { NewDeaths: number; },b: { NewDeaths: number; }) => (b.NewDeaths - a.NewDeaths));
      })

    }
    else if (sort == 12) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { TotalDeaths: number; },b: { TotalDeaths: number; }) => (a.TotalDeaths - b.TotalDeaths));
      })

    }
    else if (sort == 13) {
      
      this.http.get(url).subscribe((res)=>{
        this.dataGlobal = res;
        this.dataCountries = this.dataGlobal.Countries.sort((a: { TotalDeaths: number; },b: { TotalDeaths: number; }) => (b.TotalDeaths - a.TotalDeaths));
      })

    }

  }


  createPieChart() {

    this.pieChartData = [this.mortalityRate, this.recoveryRate, 100*this.dataGlobal.Global.TotalConfirmed/this.totalCase];

  }



  createBarChart() {

    // new api because last one returns 0 and null
    const urlBar ='https://corona.lmao.ninja/v2/historical/all?lastdays=8'
    
    this.http.get(urlBar).subscribe( (res) => {
    
      this.dataWeek = res;
      this.barChartLabels =  Object.keys(this.dataWeek["cases"]);
      this.barChartLabels.shift(); // to make sure that the good day is under the good bar (since we took 8 days and label only 7)
      // bar values
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
      // create bar data
      this.barChartData = [
        {data: deathsArray, label: 'Daily Deaths'},
        {data: recoveredArray, label: 'Daily Recovered'},
        {data: casesArray, label: 'Daily New Cases'}
      ];

    })

  }


  createLineChart() {

    const urlLine ='https://corona.lmao.ninja/v2/historical/all'
    
    this.http.get(urlLine).subscribe((res)=>{
    
      this.dataMonth = res;

      const deathsData: any = Object.values(this.dataMonth["deaths"]);
      const recoveredData: any = Object.values(this.dataMonth["recovered"]);
      const casesData: any = Object.values(this.dataMonth["cases"]);
      this.chartLineData = [
        {data: deathsData, label: 'Total Deaths'},
        {data: recoveredData ,label: 'Total Recovered'},
        {data: casesData, label: 'Total New Cases'}
      ];
      this.chartLineLabels = Object.keys(this.dataMonth["cases"]);

    })


  }


  goToCountry(countryName: string){

    if (this.user == null && this.userSignedIn()) {

      this.user = JSON.parse(localStorage.getItem("user")!);

    }

    const url ='https://api.covid19api.com/summary'
    this.http.get(url).subscribe((res : any)=>{
      
      var dataCountry;
      for (let country of res.Countries) {

        if (country.Country == countryName){

          dataCountry = country;

        }

      }
      const country = {

        country: dataCountry.Country,
        newConfirmed: dataCountry.NewConfirmed,
        totalConfirmed: dataCountry.TotalConfirmed,
        newRecovered: dataCountry.NewRecovered,
        totalRecovered: dataCountry.TotalRecovered,
        newDeaths: dataCountry.NewDeaths,
        totalDeaths: dataCountry.TotalDeaths

      }

      localStorage.setItem("country", JSON.stringify(country));
      this.updateCountry(country);
  
      this.router.navigate(["country"]);

    });

  }

  updateCountry(country: Country) {


    this.firestore.collection("countries/idCountries/"+ country.country)
                  .doc("lastUpdated")
                  .get()
                  .subscribe((doc: any)=> {
                    if (doc.exists){
                      const lastUpdated = doc.data()["lastUpdated"]
                      if (lastUpdated != new Date()) {

                        this.firestore.collection("countries/idCountries/" + country.country)
                        .add({
    
                            "NewConfirmed": country.newConfirmed,
                            "TotalConfirmed": country.totalConfirmed,
                            "NewDeaths": country.newDeaths,
                            "TotalDeaths": country.totalDeaths,
                            "NewRecovered": country.newRecovered,
                            "TotalRecovered": country.totalRecovered,
                            "lastUpdated": new Date()

                        })

                      }
                      
                    } else {

                      this.firestore.collection("countries/idCountries/" + country.country)
                      .add({
  
                          "NewConfirmed": country.newConfirmed,
                          "TotalConfirmed": country.totalConfirmed,
                          "NewDeaths": country.newDeaths,
                          "TotalDeaths": country.totalDeaths,
                          "NewRecovered": country.newRecovered,
                          "TotalRecovered": country.totalRecovered,
                          "lastUpdated": new Date()

                      })
                  
                    }
                  
                  });

  }
  

  getCountry() {
      return JSON.parse(localStorage.getItem("country")!);
  }


  beEligibleOnOff() {

    this.getUser()!.isEligible = !(this.getUser()!.isEligible);
 

  }


}
