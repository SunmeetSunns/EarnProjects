import { ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { Component,ElementRef,Input,Output,OnInit, ViewChild } from '@angular/core';
import { EventEmitter } from 'node:stream';

@Component({
  selector: 'app-observablespractise',
  standalone: true,
  imports: [],
  templateUrl: './observablespractise.component.html',
  styleUrl: './observablespractise.component.css'
})
export class ObservablespractiseComponent implements OnInit{

  searchText:string='';
  @Input() product='Hello';
  @Output() searchTextChanged: EventEmitter=new EventEmitter();
  @ViewChild ('searchInput') searchInputEl:ElementRef;
  @ViewChildren ('inputEl') inputelements : QueryList<ElementRef>;

  ngOnInit(): void {
    
  }

  constructor(){

  }
  show(){
    this.inputelements.forEach((el:ElementRef)=>{
      console.log(el.nativeElement.value);
    })
  }
  onBtnclick(){
    this.searchText=this.searchInputEl.nativeElement.value;
    this.searchTextChanged.emit(this.searchText)
  }
}
