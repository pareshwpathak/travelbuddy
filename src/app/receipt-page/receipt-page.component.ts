import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError, skip, throwError } from 'rxjs';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})
export class ReceiptPageComponent implements OnInit {

  
  name = 'Angular';
  selectedValue :any ='';
  travellingModeDetails:string='';
  prnNumber:any = '';
  ticketNumber:any = '';
  ticketAmount:number =0;
  serviceCharge:number =0;
  transactionCancelCharge:number =0;
  netPayable:number=0;

  travellingForm: FormGroup;
  buttonFlag:boolean = false;
  addUserClickCount:number = 1;
  outputDataSharedSuccess:boolean = false;
  outputDataSharedFailed:boolean = false;
  agentName:any='ash';
  successMessage = 'Receipt generated successfully';
  failedMessage = '';
  alertMessage = '';
  billToDetailsFlag : boolean = false;

  constructor(private fb:FormBuilder,private route: ActivatedRoute, private http: HttpClient) {
    //Get agentName from the URL
    this.agentName = this.route.snapshot.paramMap.get('agentName');

    this.travellingForm = this.fb.group({
      agentName: this.agentName,
      travellingDate:'',
      bookingDate:'',
      billNumber:'',
      billTo:'',

      travellingList: this.fb.array([]) ,
    });
  }
  ngOnInit(): void {
    
   // throw new Error('Method not implemented.');
  }


  travellingList() : FormArray {
    return this.travellingForm.get("travellingList") as FormArray
  }

  newQuantity(): FormGroup {
    console.log('new quuantity')
    return this.fb.group({
      travelerName: '',
      age: '',
    })
  }

  get capValues() {
    return this.travellingForm.get('travellingList') as FormArray;
  }
  
  addQuantity() {
        
    this.travellingList().push(this.newQuantity());

    if(this.addUserClickCount > 8){
      this.buttonFlag = ! this.buttonFlag;
    }
    this.addUserClickCount = this.addUserClickCount + 1 ;
    console.log('(this.travellingList) ',this.travellingList)

  }

  removeQuantity(i:number) {
    this.addUserClickCount = this.addUserClickCount - 1 ;

    if(this.addUserClickCount <= 8){
      this.buttonFlag = ! this.buttonFlag;
    }
    this.travellingList().removeAt(i);
  }
  outputValues: any;


  onSubmit() {
    this.failedMessage = '';
    this.alertMessage = this.successMessage;
    let formValues = this.travellingForm.value;

    formValues = JSON.parse(JSON.stringify(formValues));

    let fetch = JSON.stringify(formValues);

    if(formValues['billTo'] == ''){
      this.billToDetailsFlag = true;
    }

    var returnFormData =
                     {
                        "travellingName":this.travellingModeDetails,
                         "prnNumber": this.prnNumber,
                         "ticketNumber": this.ticketNumber,
                         "ticketAmount":this.ticketAmount,
                         "serviceCharge":this.serviceCharge,
                         "transactionCancelCharge":this.transactionCancelCharge,
                         "netPayable": this.netPayable,
                         "travellingMode": this.selectedValue,
                         "ticketDetails" : formValues
                     };

  let returnObject = JSON.stringify(returnFormData);

  console.log('Final Return Object ',returnObject);
  this.outputDataSharedSuccess =  true;

  
  var requestBody = JSON.parse(returnObject);

  this.validateAllInputFields(requestBody);
  
  if(this.failedMessage == ''){
    this.validatePassengerDetails(requestBody);
  }
  }

  onKeyUp(ticketAmt:number){
    this.serviceCharge = Number(ticketAmt) * 0.16;
    let serviceChg = Number(this.serviceCharge).toFixed(2);
    this.serviceCharge = Number(serviceChg);
  }

  netPayableCalc(ticketAmt:number, serviceChg:number, cancellationChg:number){
      this.netPayable = Number(ticketAmt) + Number(serviceChg) + Number(cancellationChg);
  }


  passengerDetailsFlag = false;
  apiResponse : any;
  validatePassengerDetails(requestBody:any){
      var allPassengers = this.capValues;
      var passengerDetails:any = [];
      passengerDetails = allPassengers.value;
      
      for(let len=0; len<passengerDetails.length;len++ ){
        console.log(len);
        let travelerName =passengerDetails[len]['travelerName'];
        let age = passengerDetails[len]['age']
        
        if(travelerName == '' || age == 0){
          this.outputDataSharedFailed = true;
          this.outputDataSharedSuccess =  false;
          this.failedMessage = 'Please add passenger details';
        }
        
      }
      
      if(passengerDetails.length == 0){
        this.outputDataSharedFailed = true;
        this.outputDataSharedSuccess =  false;
        this.failedMessage = 'Please add passenger details';
       }

       
       let response = this.getUsers().subscribe((data) => {
          this.apiResponse = data;
          console.log('response ....', data);
          console.log('s',this.apiResponse);
       });

       
      // this.postReceiptData( obj);

       this.http.post(this.baseUrl,requestBody,{responseType: 'text'}).subscribe(data => {
         alert('hi');
       });
  }


  private baseUrl = "http://localhost:9090/generateReceipt/print";

  getUsers(){
    
    return this.http.get("http://localhost:9090/generateReceipt/get",{responseType: 'text'})
        .
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
  }    

validateAllInputFields(formInputFields:any): any{
    if(formInputFields['ticketDetails']['billNumber']==''){
      this.failedMessage = 'Please provide Bill Number';
    }
     else if(formInputFields['ticketDetails']['bookingDate']==''){
      this.failedMessage = 'Please provide booking date';
    }
       
    else if(formInputFields['ticketDetails']['billTo']==''){
      this.failedMessage = 'Please provide details in BillTo field';
    }
    else if(formInputFields['travellingMode']==''){
      this.failedMessage = 'Please select travelling mode option';
    }
    else if(formInputFields['travellingName']==''){
      this.failedMessage = 'Please provide Travelling Vehicle Name';
    }
    else if(formInputFields['prnNumber']==''){
      this.failedMessage = 'Please provide PRN Number';
    }
    else if(formInputFields['ticketNumber']==0 || formInputFields['ticketAmount']==0){
      this.failedMessage = 'Please provide Ticket Number/Amount';
    }
    else if(formInputFields['transactionCancelCharge']==0){
      this.failedMessage = 'Please provide ticket cancellation charge';
    }
    else if(formInputFields['ticketDetails']['travellingDate'] == '' || 
            formInputFields['ticketDetails']['travellingDate'] != ''){
      
      var todayDate = new Date().toISOString().slice(0, 10);
      console.log(todayDate);
      
      let travellingDate = formInputFields['ticketDetails']['travellingDate'];
      
      if(travellingDate > todayDate || travellingDate === todayDate){
        console.log('Travelling date is future date');
        skip;
      }
      else{
        this.failedMessage = 'Please provide future date for travelling';
        console.log('Please provide future date for travelling');
        
      }

    }
    if(this.failedMessage != ''){
      this.outputDataSharedFailed = true;
      this.outputDataSharedSuccess =  false;
    }
  }
}

