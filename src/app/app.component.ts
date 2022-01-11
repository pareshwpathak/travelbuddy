import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  selectedValue :any ='';
  travellingModeDetails:any;
  prnNumber:any = '';
  ticketNumber:any = '';
  ticketAmount:number =0;
  serviceCharge:number =0;
  transactionCancelCharge:number =0;
  netPayable:number=0;

  travellingForm: FormGroup;
  buttonFlag:boolean = false;
  addUserClickCount:number = 1;
  outputDataShared:boolean = false;

  constructor(private fb:FormBuilder) {
    this.travellingForm = this.fb.group({
      agentName: 'Paresh',
      travellingDate:'',
      bookingDate:'',
      billNumber:'',
      billTo:'',

      travellingList: this.fb.array([]) ,
    });
  }


  travellingList() : FormArray {
    return this.travellingForm.get("travellingList") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      travelerName: '',
      age: '',
    })
  }

  addQuantity() {
    this.addUserClickCount = this.addUserClickCount + 1 ;

    if(this.addUserClickCount > 8){
      this.buttonFlag = ! this.buttonFlag;
    }
    this.travellingList().push(this.newQuantity());
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

    let formValues = this.travellingForm.value;

    formValues = JSON.parse(JSON.stringify(formValues));

    let fetch = JSON.stringify(formValues);


    var returnFormData =
                     {
                         "prnNumber": this.prnNumber,
                         "ticketNumber": this.ticketNumber,
                         "ticketAmount":this.ticketAmount,
                         "serviceCharge":this.serviceCharge,
                         "transactionCancelCharge":this.transactionCancelCharge,
                         "netPayable": this.netPayable,
                         "ticketDetails" : formValues
                     };

  let returnObject = JSON.stringify(returnFormData);

  console.log('Final Return Object ',returnObject);
  this.outputDataShared =  true;
  }

  onKeyUp(ticketAmt:number){
    this.serviceCharge = Number(ticketAmt) * 0.16;
    let serviceChg = Number(this.serviceCharge).toFixed(2);
    this.serviceCharge = Number(serviceChg);
  }

  netPayableCalc(ticketAmt:number, serviceChg:number, cancellationChg:number){
      this.netPayable = Number(ticketAmt) + Number(serviceChg) + Number(cancellationChg);
  }
}
