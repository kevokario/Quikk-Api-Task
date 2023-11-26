import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  title = 'Quikk Api'

  constructor() { }

  showSidebar = true;

  ngOnInit(): void {
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar;
  }

}
