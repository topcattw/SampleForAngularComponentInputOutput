import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  
  //傳回的資料存放屬性
  txtWeekDay1:string='';
  txtWeekDay2:string='';
  txtWeekDay3:string='';
  

  constructor() { }

  ngOnInit() {
  }

  //將傳回的資料，放入txtWeekDay
  putSelectedDateInDefault1($event: MouseEvent){
    console.log($event);
    this.txtWeekDay1 = $event.toString();
  }
  putSelectedDateInDefault2($event: MouseEvent){
    console.log($event);
    this.txtWeekDay2 = $event.toString();
  }
  putSelectedDateInDefault3($event: MouseEvent){
    console.log($event);
    this.txtWeekDay3 = $event.toString();
  }

}
