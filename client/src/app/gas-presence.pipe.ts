import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'gasPresence'
})
export class GasPresencePipe implements PipeTransform {

    transform(value: boolean | string): string {
        if(value && value === '-') {
            return '-';
        } else {
            return (!!value) ? 'OK' : 'KO';
        }
    }

}
