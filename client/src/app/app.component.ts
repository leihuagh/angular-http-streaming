import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Angular infinite stream';
    pings: Array<String>;
    sseSupported: boolean;
    fetchSupported: boolean;
    timestamp: Date | string;
    dashboard = { light: '-', temperature: '-', gas: '-' };
    monitorSuscriber: BehaviorSubject<string>;

    constructor(private appSrv: AppService) {}

    ngOnInit() {
        //this.timestamp = 'None';
        this.sseSupported = (<any>window).EventSource;
        this.fetchSupported = (<any>window).fetch;
        this.monitorSuscriber = new BehaviorSubject<string>('');
        this.monitorSuscriber.filter((sensors) => sensors !== '' && sensors !== null).subscribe((sensorsData) => {  
            this.updateDashboard(sensorsData);
        });
    }

    startStreamingWithHttpModified() {
        this.appSrv.callToBackEnd(this.monitorSuscriber).subscribe();
    }

    startStreamingWithFetch() {
        this.appSrv.callToBackEndWithFetch(this.monitorSuscriber);

        // Other implementation approach
        /*this.appSrv.callToBackEndWithFetch2().subscribe((sensorsData) => {
            this.updateDashboard(sensorsData);
        });*/
    }

    stopStreaming() {
        this.appSrv.stopStreaming();
    }

    private updateDashboard(data) {
        let sensorsData;
        if(data && typeof(data) === 'string') {
            sensorsData = JSON.parse(data);
        } else {
            sensorsData = data;
        }

        this.timestamp = sensorsData.dataTimestamp;
        this.dashboard = sensorsData.sensors;  // Using destructuring
    }

}
