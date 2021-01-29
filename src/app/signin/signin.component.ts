import { Component, OnInit } from '@angular/core';
import { MycovidService } from '../mycovid.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public mycovidService: MycovidService) { }

  ngOnInit(): void {
  }

}
