# SampleForAngularComponentInputOutput
Sample For Angular 2/4 Component Input / Output

### 緣起

在 Angular 2 / 4 的世界中，是一個一個的 Component 堆積而成的，每個 Component 都是獨立，卻又可以交互合作，在這樣的情況下，外層的 Component 如何傳遞入（Input）資料給內層的 Component ，而內層的資料，在要把資料往外傳遞（Output）時，又如何觸發外層的事件來處理往外傳遞的資料。我們這一篇就來看看 Component 的 Input / Output 如何撰寫

### 範例目標說明

小喵這個範例，要做得是，撰寫一個Modal的Component，他裡面放一個 [Bootstrap 的 Modal](https://v4-alpha.getbootstrap.com/components/modal/)（對話盒），這個Modal（對話盒）中間有個下拉選單，選擇「星期一～星期日」，選取後，傳回，將選取的資料維護到一個 Input Text 裡面。而這樣的情況連續三個，所以這個Modal是『寫一個，可以重複使用』的。類似以下畫面：

![](https://az787680.vo.msecnd.net/user/topcat/d240dd15-781a-4050-9f2e-47e5229a0478/1505445851_54001.png)

### 撰寫 Component Modal

在清楚要做到的目標後，首先，先撰寫 Modal 這一個 Component 。先用指令產生 Modal 的 Component

    ng g c Modal

首先，先針對『ts』處理一下：

modal.component.ts:

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

接著html設計如下：

    <!-- 透過ngClass來綁show這個css class -->
    <button (click)="this.ModalShow='Show'">{{this.buttonShowText}}</button>
    <div class="modal" [ngClass]="{show: this.ModalShow}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <!-- 打X關閉顯示，這裡用click事件綁定，處理ModalShow='' -->
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" (click)="this.ModalShow=''">&times;</button>
            <h4 class="modal-title">Modal title</h4>
          </div>
          <div class="modal-body">
            <p>One fine body…</p>
            <form action="">
              <!-- 透過ngModel綁定selectedDay -->
              <select name="WeekDay" id="WeekDay" [(ngModel)]="selectedDay">
                <option value="星期一">星期一</option>
                <option value="星期二">星期二</option>
                <option value="星期三">星期三</option>
                <option value="星期四">星期四</option>
                <option value="星期五">星期五</option>
                <option value="星期六">星期六</option>
                <option value="星期日">星期日</option>
              </select>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" (click)="this.ModalShow='';">Close</button>
            <!-- doOutputSelect Function -->
            <button type="button" class="btn btn-primary" (click)="doOutputSelect()">確認選取</button>
          </div>
        </div>
      </div>
    </div>

這樣，Modal的Component就已經OK囉。  
接著，是要來看看怎麼呼叫使用這個Component

### 撰寫套用 Modal 的父層 Component

為了讓使用的範例單純，小喵新增一個 default 的 component 裡面放三組 textbox + button + 「Modal Component」

先設計第一組，之後的兩組就可以依樣畫葫蘆的處理。

default.component.ts

    import { Component, OnInit } from '@angular/core';

    @Component({
      selector: 'app-default',
      templateUrl: './default.component.html',
      styleUrls: ['./default.component.css']
    })
    export class DefaultComponent implements OnInit {

      //傳回的資料存放屬性
      txtWeekDay1:string='';

      constructor() { }

      ngOnInit() {
      }

      //將傳回的資料，放入txtWeekDay
      putSelectedDateInDefault1($event: MouseEvent){
        console.log($event);
        this.txtWeekDay1 = $event.toString();
      }
    }

接著，重頭戲來了，就是如何在html中，使用component的過程中，使用 Input, Output

    <!-- 綁定txtWeekDay1 -->
    <input type="text" [(ngModel)]="txtWeekDay1"> 
    <!-- 透過『屬性綁定』，將Default中的「txtWeekDay1」指定給 Modal 中『Input』的 「selectedDay」 屬性 -->
    <!-- 透過『事件綁定』，將Modal中『Output』的事件「getSelectedDateInModal」綁上Default的「putSelectedDateInDefault1()」函數 -->
    <app-modal [selectedDay]="this.txtWeekDay1"  [buttonShowText]="'顯示Modal1'" (getSelectedDateInModal)="putSelectedDateInDefault1($event)"></app-modal>
    <hr>

Input的部分，透過『屬性綁定』( [selectedDay]="this.txtWeekDay1" [buttonShowText]="'顯示Modal1'" )，將資料綁定上去。

Output的部分，由於資料傳出後，要觸發父層的函數來做事情，所以用『事件綁定』 ((getSelectedDateInModal)="putSelectedDateInDefault1($event)") 的方式處理

就醬子，按下按鈕，可以開啟Modal，選擇好後按下傳回，就可以把資料放入父層的Input Text 。

最後，一份放成三份，這個過程就不會再去動『Modal』這個 Component的內容了～  
修改default.component.ts

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

修改default.component.html:

    <p>
      default works!
    </p>
    <!-- 綁定txtWeekDay1 -->
    <input type="text" [(ngModel)]="txtWeekDay1"> 
    <!-- 透過『屬性綁定』，將Default中的「txtWeekDay1」指定給 Modal 中『Input』的 「selectedDay」 屬性 -->
    <!-- 透過『事件綁定』，將Modal中『Output』的事件「getSelectedDateInModal」綁上Default的「putSelectedDateInDefault1()」函數 -->
    <app-modal [selectedDay]="this.txtWeekDay1"  [buttonShowText]="'顯示Modal1'" (getSelectedDateInModal)="putSelectedDateInDefault1($event)"></app-modal>
    <hr>

    <input type="text" [(ngModel)]="txtWeekDay2">
    <app-modal [selectedDay]="this.txtWeekDay2" [buttonShowText]="'顯示Modal2'" (getSelectedDateInModal)="putSelectedDateInDefault2($event)"></app-modal>
    <hr>

    <input type="text" [(ngModel)]="txtWeekDay3">
    <app-modal [selectedDay]="this.txtWeekDay3" [buttonShowText]="'顯示Modal3'" (getSelectedDateInModal)="putSelectedDateInDefault3($event)"></app-modal>
    <hr>

### 末記

Component 的設計概念，其中之一就是希望未來可以重複使用。所以在設計Component的時候，就要思考，怎麼讓他的設計可以斷開其他的耦合，讓Component在設計的時候，可以不管外部誰在用，傳出資料後會怎麼用。我只要設計好讓外部可以傳入資料（Input），可以透過事件傳出資料（Output），至於外部使用的人收到資料，要怎麼使用，這 Component 不必管。

以上的範例提供大家參考，也提供小喵自己筆記一下。

^_^
