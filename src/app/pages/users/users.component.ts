import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  loading = true;
  allUsers = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private apiService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.loading = true;
    this.allUsers = [];
    this.apiService.getAllUsers().valueChanges.subscribe(
      data => {
        this.allUsers = data.data['getUser_Q'];
        this.jQueryLibraryInit();
        this.loading = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  jQueryLibraryInit() {
    const jquery1 = document.createElement('script');
    jquery1.type = 'text/javascript';
    jquery1.src = 'https://code.jquery.com/jquery-3.3.1.js';
    this.elementRef.nativeElement.appendChild(jquery1);

    const jquery2 = document.createElement('script');
    jquery2.type = 'text/javascript';
    jquery2.src = 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js';
    this.elementRef.nativeElement.appendChild(jquery2);

    const jquery3 = document.createElement('script');
    jquery3.type = 'text/javascript';
    jquery3.src = 'https://cdn.datatables.net/buttons/1.5.6/js/dataTables.buttons.min.js';
    this.elementRef.nativeElement.appendChild(jquery3);

    const jquery4 = document.createElement('script');
    jquery4.type = 'text/javascript';
    jquery4.src = 'https://cdn.datatables.net/buttons/1.5.6/js/buttons.flash.min.js';
    this.elementRef.nativeElement.appendChild(jquery4);

    const jquery5 = document.createElement('script');
    jquery5.type = 'text/javascript';
    jquery5.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js';
    this.elementRef.nativeElement.appendChild(jquery5);

    const jquery6 = document.createElement('script');
    jquery6.type = 'text/javascript';
    jquery6.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js';
    this.elementRef.nativeElement.appendChild(jquery6);

    const jquery7 = document.createElement('script');
    jquery7.type = 'text/javascript';
    jquery7.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js';
    this.elementRef.nativeElement.appendChild(jquery7);

    const jquery8 = document.createElement('script');
    jquery8.type = 'text/javascript';
    jquery8.src = 'https://cdn.datatables.net/buttons/1.5.6/js/buttons.html5.min.js';
    this.elementRef.nativeElement.appendChild(jquery8);

    const jquery9 = document.createElement('script');
    jquery9.type = 'text/javascript';
    jquery9.src = 'https://cdn.datatables.net/buttons/1.5.6/js/buttons.print.min.js';
    this.elementRef.nativeElement.appendChild(jquery9);

    const jquery10 = document.createElement('script');
    jquery10.type = 'text/javascript';
    jquery10.src = 'https://cdn.datatables.net/buttons/1.5.6/js/buttons.colVis.min.js';
    this.elementRef.nativeElement.appendChild(jquery10);

    const jquery11 = document.createElement('script');
    jquery11.type = 'text/javascript';
    // jquery11.src = './assets/js/datatable.js';
    jquery11.src = '../../../assets/js/datatable.js';
    this.elementRef.nativeElement.appendChild(jquery11);
  }
}
