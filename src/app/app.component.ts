import { Component } from '@angular/core';
import { CsvDataModel } from './model/CsvDataModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  form = {
    data: {
        numberOfInputFiles: <number> 0,
        records: <CsvDataModel[]> [],
        headerArray: <string[]> [],
        headerMap: <Map<string, boolean>> new Map<string, boolean>(),
        selectedRecord: null,
        searchedRecords: <any[]> [],
        searchCriteria: <string> 'id'
    },
    ui: {
        searchInput: <string> null
    }
  };

  constructor() {

  }

  isValidCsvFile(fileName: string) {
    return fileName.endsWith('.csv');
  }


  getCsvFile(event: any) {
    if (event.target.files && this.isValidCsvFile(event.target.files[0].name)) {
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = () => {
        const data = reader.result;
        const dataRow = (<string>data).split(/\r\n|\n/);
        const headerRow = this.getCsvHeaderData(dataRow);
        this.form.data.records = [...this.form.data.records, ...this.getCsvDataFromFile(dataRow, headerRow.length)];
        this.form.data.numberOfInputFiles ++;
      };

      reader.onerror = () => {
        console.log('Something went wrong!');
      };
    } else {
      alert('Invalid CSV file');
    }
  }

  getCsvHeaderData(records: any) {
    if (this.form.data.numberOfInputFiles === 0) {
      const headers = (<string>records[0]).split(',');
      this.form.data.headerMap.set('id', true);
      for (let j = 0; j < headers.length; j++) {
        this.form.data.headerArray.push(headers[j]);
        this.form.data.headerMap.set(headers[j], false);
      }
    }
    return this.form.data.headerArray;
  }

  getCsvDataFromFile(dataRow: any, headerLength: any) {
    const currentFileRecords: any[] = [];

    const prevCount = Object.keys(this.form.data.records).length;
    for (let i = 1; i < dataRow.length; i++) {
      const curruntRecord = (<string>dataRow[i]).split(',');
      if (curruntRecord.length === headerLength) {
        const csvModal: CsvDataModel = new CsvDataModel();
        csvModal.id = i + prevCount;
        csvModal.person = curruntRecord[0].trim();
        csvModal.tel = curruntRecord[1].trim();
        csvModal.address = curruntRecord[2].trim();
        csvModal.office = curruntRecord[3].trim();
        csvModal.task = curruntRecord[4].trim();
        csvModal.date = curruntRecord[5].trim();
        currentFileRecords.push(csvModal);
      }
    }
    return currentFileRecords;
  }

  sortBy(col: string) {
    const toggles = this.form.data.headerMap.get(col);
    if (toggles === true) {
      this.form.data.records.sort((a, b) => a[col] < b[col] ? 1 : a[col] > b[col] ? -1 : 0);
    } else {
      this.form.data.records.sort((a, b) => a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0);
    }

    this.form.data.headerMap.forEach((value: boolean, key: string) => {
        if (key !== col) {
          this.form.data.headerMap.set(key, false);
        } else {
          this.form.data.headerMap.set(col, !toggles);
        }
    });
  }

  disableSort() {
    return 0;
  }

  searchByCriteria(event: any) {
    this.form.data.searchedRecords = this.form.data.records.filter(record => record[this.form.data.searchCriteria] == event.target.value);
    if (this.form.data.searchedRecords.length < 1) { alert('Result NOT Found\nTable Reset'); }
  }

  reset() {
    this.form.data.searchedRecords = [];
    this.form.data.selectedRecord = null;
    this.form.ui.searchInput = null;
  }

  showDetails(recordId: number) {
    console.log(recordId)
    this.form.data.selectedRecord = this.form.data.records.find(record => record.id === recordId);
  }
}

