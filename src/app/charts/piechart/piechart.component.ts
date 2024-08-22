import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
})
export class PiechartComponent implements OnInit {
  @Input() data: any;
  @Input() pData: any;
  legend: any;
  show = true;
  constructor(public translateService: TranslateService) {

    this.translateService.onLangChange.subscribe(() => this.languageChange());

    this.legend = {
      display: true,
      position: 'bottom',
      fullWidth: true,
      labels: {
        // This more specific font property overrides the global property
        fontFamily: '"Prompt-Medium",Prompt-Light, Arial, sans-serif',
        fontColor: 'black',
        padding: 30
      }
    };
  }

  ngOnInit() {
    // this.languageChange();  // to be uncommended
    this.percentage();  // to be removed
  }

  languageChange() {
    const labels = [];
    this.pData.labels.map(async label => {
      await this.translateService.get(label).subscribe(value => {
        labels.push(value);
      });
    });
    this.pData.labels = labels;
    // this.percentage();
  }

  useAnotherOneWithWebpack() {
    const normal = (document.getElementById('canvas-chart') as any).getContext('2d');
    // tslint:disable-next-line:no-unused-expression
    new Chart(normal, {
      // The type of chart we want to create
      type: 'pie',

      // The data for our dataset
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true
        },
        legend: this.legend,
      }
    });
  }

  percentage() {
    const percentage = (document.getElementById('canvas-chart') as any).getContext('2d');
    // tslint:disable-next-line:no-unused-expression
    new Chart(percentage, {
      // The type of chart we want to create
      type: 'pie',

      // The data for our dataset
      data: this.pData,
      options: {
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              // get the concerned dataset
              const dataset = data.datasets[tooltipItem.datasetIndex];
              // calculate the total of this data set
              const total = dataset.data.reduce((previousValue, currentValue, currentIndex, array) => {
                return previousValue + currentValue;
              });
              // get the current items value
              const currentValue = dataset.data[tooltipItem.index];
              // calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
              const percentage = Math.floor(((currentValue / total) * 100) + 0.5);

              return `${data.labels[tooltipItem.index]}: ${percentage}%`;
            }
          }
        },
        legend: this.legend,
      }
    });
  }

}
