import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-input-wrapper',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss']
})
export class InputWrapperComponent{
  @Input() inputLabel!: string;
  @Input() inputPlaceholder!: string;
  @Input() inputType!: string;
  @Input() control=  new FormControl();
  @Input() submitted! : boolean;

  getErrorMessage() {
    if(this.control.hasError('pattern')){
      return "Błędne dane"
    }
    if (this.control.hasError('required')) {
      return `Puste pole`;
    }
    if (this.control.hasError('email')) {
      return `Błędny email`;
    }
    if (this.control.hasError('minlength')) {
      return `Za krótkie`;
    }
    if (this.control.hasError('maxlength')) {
      return `Za długie`;
    }
    if (this.control.hasError('emailExist')) {
      return `Email zajęty`;
    }
    if (this.control.hasError('usernameExist')) {
      return `Nazwa użytkownika zajęta`
    }
    if (this.control.hasError('emailNonExist')) {
      return 'Nie ma takiego Emaila'
    }
    if (this.control.hasError('badPassword')) {
      return `Hasło nie zgadza się z zapisanym`
    }
    if (this.control.hasError('databaseError')) {
      return `Błąd bazy danych`
    }
    if (this.control.hasError('passwordMismatch')) {
      return 'Hasła się nie zgadzają'
    }
    if (this.control.hasError('passwordInvalid')) {
      return 'Hasło musi mieć cyfrę, znak specialny, mała i wielka litere'
    }
    if (this.control.hasError('success')) {
      return `Czynność powiodła się!`
    }
    return '';
  }
}
