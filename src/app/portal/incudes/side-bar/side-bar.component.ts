import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss','./../../portal.component.scss']
})
export class SideBarComponent implements OnInit {

  @Input() showSidebar = false;
  @Input() title = '';
  @Output() toggleSidebarEvt:EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar() : void {
    this.toggleSidebarEvt.emit();
  }

}
