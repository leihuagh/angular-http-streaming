import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {

    constructor(private httpSrv: Http) {}

    callToBackEnd(streamSubscriber$: BehaviorSubject<string>): Observable<any> {
        console.log('[Service] Calling to backend with modified Angular HTTP Service...');

        // Original instruction:  this.httpSrv.get('/api/http-stream')
        return this.httpSrv.get('/api/http-stream', { chunks$: streamSubscriber$ })
            .map((res: Response) => { 
                console.log('NG) ', res);
            })
            .catch((err: Response | any) => { 
                console.log('ERR: ', err);
                return Observable.throw(err.statusText); 
            });
    }

    callToBackEndWithFetch(streamSubscriber$: BehaviorSubject<string>) {
        console.log('[Service] Calling to backend with fetch...');

        // More info:   https://fetch.spec.whatwg.org/
        fetch('/api/http-stream')
            .then((response) => {
                let streamChunkExtractor = (reader) => {
                    return reader.read().then((result) => {
                        if(result.done) {
                            return;
                        }

                        let chunk = result.value;
                        let text = '';
                        for(let i=0; i<chunk.byteLength; i++) {
                            text += String.fromCharCode(chunk[i]);
                        }

                        streamSubscriber$.next(text);
                        return streamChunkExtractor(reader);
                    });
                };
                return streamChunkExtractor(response.body.getReader());
            })
            .catch((err) => { console.log('Error: ', err) });
    }

    stopStreaming() {
        console.log('[Service] Stopping the streaming');
        this.httpSrv.get('/api/stop-stream').subscribe();
    }

}