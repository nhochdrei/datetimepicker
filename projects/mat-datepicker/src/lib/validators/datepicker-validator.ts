import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function DateValidator(control: AbstractControl) {
    const val = moment(control.value, 'DD.MM.YYYY', true);

    if (!val.isValid()) {
        return { invalidDate: true };
    }

    return null;
}
