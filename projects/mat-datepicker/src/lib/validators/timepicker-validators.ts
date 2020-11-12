import { AbstractControl } from '@angular/forms';
import moment from 'moment';

export function TimeValidator(control: AbstractControl) {
    const time = moment(control.value).format('HH:mm');
    const hours = +time.substr(0, time.indexOf(':'));
    const minutes = +time.substr(time.indexOf(':') + 1);

    if (hours > 23 || hours < 0 || Number.isNaN(hours)) { return { invalidTime: true }; }
    if (minutes > 59 || minutes < 0 || Number.isNaN(minutes)) { return { invalidTime: true }; }

    return null;
}
