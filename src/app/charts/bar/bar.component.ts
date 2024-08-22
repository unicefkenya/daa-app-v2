import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core'
import { Chart } from 'chart.js'

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {

  @ViewChild("bar_canvas", { static: true }) barCanvas: ElementRef

  @Input() data: any;
  @Input() test: any;
  chart: Chart;

  constructor() { }

  ngOnInit() {
    this.genarateBarChart(this.data);
  }

  genarateBarChart(data: any) {

    this.chart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: 'Present',
            data: this.data.presents,
            backgroundColor: [
              'rgba(32, 150, 243, 1)',
              'rgba(32, 150, 243, 1)',
              'rgba(32, 150, 243, 1)',
              'rgba(32, 150, 243, 1)',
            ],
            borderColor: [
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0)',
            ],
            borderWidth: 1
          },
          {
            label: 'Absent',
            data: this.data.absents,
            backgroundColor: [
              'rgba(245, 217, 8, 1)',
              'rgba(245, 217, 8, 1)',
              'rgba(245, 217, 8, 1)',
              'rgba(245, 217, 8, 1)',
              'rgba(245, 217, 8, 1)',
              'rgba(245, 217, 8, 1)',
            ],
            borderColor: [
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0)',
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Weekly Attendance Chart',
          position: 'top',
          fontFamily: '"Prompt-Medium",Prompt-Light, Arial, sans-serif'
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepValue: 1,
              max: 8,
              fontSize: 11,
              fontFamily: '"Prompt-Medium",Prompt-Light, Arial, sans-serif',
              gridLines: {
                display: false,
                lineWidth: 0
              },
            }
          }],
          xAxes: [{
            barThickness: 42,
            maxBarThickness: 40,
            gridLines: {
              offsetGridLines: true
            },
            ticks: {
              callback: function (value) {
                return 'Week of ' + value;
              },
              fontSize: 10.5,
              fontFamily: '"Prompt-Medium",Prompt-Light, Arial, sans-serif',
            }
          }]
        },
        tooltips: {
          enabled: true
        },
        legend: {
          display: true,
          position: 'bottom',
          fullWidth: true,
          labels: {
            // This more specific font property overrides the global property
            fontFamily: '"Prompt-Medium",Prompt-Light, Arial, sans-serif',
            fontColor: 'black',
            padding: 30
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }

}
