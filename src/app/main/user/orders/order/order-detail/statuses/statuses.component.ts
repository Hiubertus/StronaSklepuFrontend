import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Status} from "../../../../../../shared/models/status.model";
import {Subscription} from "rxjs";
import {StatusesService} from "../../../../../../shared/services/statuses.service";
import {StatusComponent} from "./status/status.component";

@Component({
  selector: 'app-statuses',
  standalone: true,
  imports: [
    StatusComponent
  ],
  templateUrl: './statuses.component.html',
  styleUrl: './statuses.component.scss'
})
export class StatusesComponent implements OnInit, OnDestroy {
  @Input() order_id!: number
  @Output() statusesError = new EventEmitter<void>()
  statuses: Status[] = []
  statusesSubscription!: Subscription;

  constructor(private statusesService: StatusesService) {
  }

  async ngOnInit() {
    await this.statusesService.getStatusesFromDb(this.order_id)
    this.statusesSubscription = this.statusesService.statusesChanged.subscribe({
      next: (data: Status[]) => {
        this.statuses = data
        this.statuses.push(
          {
            status_id: 1000,
            order_id: this.order_id,
            text: 'Sent',
            date: '01.08.2024'
          },
          {
            status_id: 1001,
            order_id: this.order_id,
            text: 'Delivery',
            date: '01.08.2024'
          }
        )
      }, error: () => {
        this.statusesError.emit()
      }
    })
  }

  ngOnDestroy() {
    this.statusesSubscription.unsubscribe()
  }
}
