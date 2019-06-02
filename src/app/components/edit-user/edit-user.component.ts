import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserComponent implements OnInit {
  /* Initial Variables */
  title = '';
  @Input() mode: 'as-modal';
  @Input() userInput = null;

  user: any;
  loading = false;
  isFormValid = true;
  submitted = false;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.title = 'Profile Information';
    this.user = this.userInput ? _.cloneDeep(this.userInput) : {};
    this.loading = false;
  }

  validateForm() {
    if (this.user['firstName'] && this.user['lastName'] && this.user['workerID']) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }
    return this.isFormValid;
  }

  update() {
    this.submitted = true;
    if (this.validateForm() === false) return;
    var submit_data = {
      firstName: this.user['firstName'],
      lastName: this.user['lastName'],
      workerID: this.user['workerID']
    };
    this.activeModal.close(submit_data);
  }

  closeAccount() {
    this.authService.closeAccount().valueChanges.subscribe(
      data => {
        this.activeModal.close();
        this.authService.logout();
      },
      error => {
        console.log(error);
      }
    );
  }
}
