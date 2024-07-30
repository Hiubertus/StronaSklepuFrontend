import {Component, Input} from '@angular/core';
import {Status} from "../../../../../../../models/status.model";

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  @Input() status!: Status
}
