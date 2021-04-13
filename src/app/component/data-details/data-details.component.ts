import { Component, Input, OnInit } from '@angular/core';
import { CsvDataModel } from '../../model/CsvDataModel';

@Component({
  selector: 'app-data-details',
  templateUrl: './data-details.component.html',
  styleUrls: ['./data-details.component.css']
})
export class DataDetailsComponent implements OnInit {

  @Input() data?: CsvDataModel;

  constructor() { }

  ngOnInit() {

  }

}
