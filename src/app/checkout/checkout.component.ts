import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public token: any;
  public serial_number: any; public unique_id: any;
  public base_URL: any;
  public checkout_URL: any;
  public sub_URL: any;
  checkoutForm: any;
  trans_amount:  any;
  public key_value: String = '';
  
  constructor(private _route: ActivatedRoute,
  private router: Router, 
  private http: HttpClient,
  private formBuilder: FormBuilder,
  private toastr: ToastrService) { }

  ngOnInit() {
	  this.token = localStorage.getItem('token');
	  this.serial_number = localStorage.getItem('terminal_id');
	  this.base_URL = localStorage.getItem('base_URL');
	  this.createForm();
  }
  
  createForm() {
	this.checkoutForm = this.formBuilder.group({
      amount: ['', Validators.required],
    });
	  
  }
  
  getValue(value) {
	  this.key_value = this.key_value + value;
	  console.log(this.key_value);
  }
  addPeriod() {
	  let n = this.key_value.includes(".");
	  if(!n) {
	  this.key_value = this.key_value + '.';
	  console.log(this.key_value);
	  }
  }
  delvalue() {
	  this.key_value = this.key_value.slice(0,-1);
  }

  transaction() {
	this.sub_URL = '/transaction';
	this.checkout_URL = this.base_URL+this.sub_URL+'?tid='+this.serial_number+'&silent=false';
	this.trans_amount = parseFloat(this.checkoutForm.value['amount'])*100;
	console.log(this.trans_amount);
	const headers= new HttpHeaders()
		.set('Authorization', this.token)
		.set('content-type', 'application/json')
		
	const data = JSON.stringify({
		"transType":"SALE",
		"amountTrans":this.trans_amount,
		"amountGratuity":0,
		"amountCashback":0,
		"reference":"TEST CARD",
		"language":"en_GB"
	});
	this.http.post(this.checkout_URL, data, { 'headers': headers }).subscribe((response)=>{
		localStorage.setItem('unique_id' , Object.values(response)[4]);
		setTimeout(()=>{ this.transactionStatus()}, 1000);
		},
		err => {
				this.toastr.error("Transaction Failed, Please Pair the Device Again", '');
				this.router.navigate(['/']);
		}
	)
  }
  
  transactionStatus() {
	this.unique_id = localStorage.getItem('unique_id');
	this.sub_URL = '/transaction';
	this.checkout_URL = this.base_URL+this.sub_URL+'?uti='+this.unique_id+'&tid='+this.serial_number;
	
	const headers= new HttpHeaders()
		.set('Authorization', this.token)
		.set('content-type', 'application/json')
	this.http.get(this.checkout_URL, { 'headers': headers }).subscribe((response)=>{
		console.log(response);
		console.log(Object.keys(response)[28], Object.values(response)[28]);
		console.log(Object.values(response)[33]);
		if(!Object.values(response)[33]) {
			setTimeout(()=>{ this.transactionStatus()}, 2000);
		} else {
		if(Object.values(response)[28] === true) {
			this.toastr.success("Transaction Approved");
			localStorage.removeItem('unique_id');
			this.checkoutForm.reset();

		} else {
			this.toastr.error("Transaction Declined");
			localStorage.removeItem('unique_id');
			this.checkoutForm.reset();
		}
		}
		
	},
	err => {
		this.toastr.error("Error in Fetching Transaction Status", '');
	}
	)
}
}