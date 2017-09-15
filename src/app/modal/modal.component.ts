import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  //顯示：show
  //不顯示:[空字串]
  ModalShow:string='';

  //宣告往外傳遞的事件『getSelectedDataInModal』
   @Output()
  getSelectedDateInModal = new EventEmitter();

  //用來綁定被選取的資料
  @Input()
  selectedDay:string='';

  //用來改顯示按鈕的文字，可從外面修改
  @Input()
  buttonShowText:string='顯示Modal';

  constructor() { }

  ngOnInit() {
  }

  //按下傳回的時候
  doOutputSelect(){
    //資料透過『getSelectedDateInModal』Output事件，帶出
    this.getSelectedDateInModal.emit(this.selectedDay);
    
    //讓Modal不顯示
    this.ModalShow = '';
  }

}
