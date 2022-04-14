import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import {from} from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.css']
})
export class PairComponent implements OnInit {

  pairingForm: any;
  base_URL: any; sub_URL: any; request_URL: any;
  pax_sno: any;
  
  constructor(
  private _route: ActivatedRoute,
  private router: Router, 
  private http: HttpClient,
  private formBuilder: FormBuilder,
  private toastr: ToastrService
  ) { }

  ngOnInit() {
	  this.createForm();
  }
  
  createForm() {
	this.pairingForm = this.formBuilder.group({
      ip_address: ['', Validators.required],
      serial_number: ['', Validators.required],
	  pairing_code: ['', Validators.required],
    });
	  
  }
pairTerminal() {
	this.http.get('https://www.arivpaysystem.com/api'+'/pax/serial_number', { params: {serial_number: this.pairingForm.value['serial_number']}})
		.subscribe((response)=>{
			this.pax_sno = response;
			if(this.pax_sno.length != 0){
				this.pairPAXTerminal();
			} else {
			this.toastr.error("Invalid Serial Number, Please Enter Valid Serial Number", '');
			}			
		});
}
	
 pairPAXTerminal() {
	  this.base_URL = 'https://'+ this.pairingForm.value['ip_address'] + ':8080/POSitiveWebLink/1.0.0';
	  localStorage.setItem('base_URL' , this.base_URL);
	  localStorage.setItem('terminal_id', this.pairingForm.value['serial_number']);
	  this.sub_URL = '/pair';
	  this.request_URL = this.base_URL+this.sub_URL+'?pairingCode=' + this.pairingForm.value['pairing_code'] + '&tid=' + this.pairingForm.value['serial_number'];
	  
	  const headers= new HttpHeaders()
		.set('content-type', 'application/json')
		.set('Access-Control-Allow-Origin', '*');

	  this.http.get(this.request_URL, { 'headers': headers })
		.subscribe((response)=>{
			localStorage.setItem('token' , 'Bearer '+Object.values(response)[1]);
			this.toastr.success("Device Pairing Successful", '');
			this.router.navigate(['checkout']);
		},
		err=>{
			this.toastr.error("Pairing Failed, Please Try Again", '');
		}
	)
  }
}
