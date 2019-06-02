import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteAlertModalComponent } from '../delete-alert-modal/delete-alert-modal.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: [
    './main-header.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class MainHeaderComponent implements OnInit {
  constructor(
    private apiService: AuthenticationService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  user: any;

  ngOnInit() {
    this.user = this.apiService.getCurrentUser().valueChanges.subscribe(
      data => {
        this.user = data.data['authenticateUser_Q'];
      },
      error => {
        console.log(error);
      }
    );
  }

  profile(user: any) {
    const modalRef = this.modalService.open(EditUserComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'medium-screen-modal-window'
    });
    modalRef.componentInstance.userInput = user;
    modalRef.componentInstance.mode = 'as-modal';
    modalRef.result.then(ret => {
      if (ret) {
        var submit_data = {
          id: user.id,
          firstName: ret.firstName,
          lastName: ret.lastName,
          workerID: ret.workerID
        };
        this.apiService.updateUser(submit_data).subscribe(
          data => {
            this.router.routeReuseStrategy.shouldReuseRoute = function(){
              return false;
            }

            this.router.events.subscribe((evt) => {
              if (evt instanceof NavigationEnd) {
                  // trick the Router into believing it's last link wasn't previously loaded
                  this.router.navigated = false;
                  // if you need to scroll back to top, here is the right place
                  window.scrollTo(0, 0);
              }
            });
          },
          error => { }
        );
      }
    }, () => { });
  }

  logout() {
    this.apiService.logout();
  }
}
