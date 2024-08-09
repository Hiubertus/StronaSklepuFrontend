import {Component, Input} from '@angular/core';
import {Status} from "../../../../../../../shared/models/status.model";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  @Input() status!: Status
}
