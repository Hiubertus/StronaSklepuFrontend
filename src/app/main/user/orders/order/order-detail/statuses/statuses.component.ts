import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Status} from "../../../../../../models/status.model";
import {Subscription} from "rxjs";
import {StatusesService} from "../../../../../../services/statuses.service";
import {StatusComponent} from "./status/status.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-statuses',
  standalone: true,
  imports: [
    StatusComponent,
    NgForOf
  ],
  templateUrl: './statuses.component.html',
  styleUrl: './statuses.component.scss'
})
export class StatusesComponent implements OnInit, OnDestroy{
  @Input() order_id!: number
  statuses: Status[] = []
  statusesSubscription!: Subscription;
  constructor(private statusesService: StatusesService) {
  }
  async ngOnInit() {
    await this.statusesService.getStatusesFromDb(this.order_id)
    this.statusesSubscription = this.statusesService.statusesChanged.subscribe(data => {
      this.statuses = data
    })
  }
  ngOnDestroy() {
  }
}
