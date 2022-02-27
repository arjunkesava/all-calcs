import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'gst-tab',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.css'],
})
export class GstComponent implements OnInit {
  readonly TAX_INCLUSIVE = 'add';
  readonly TAX_EXCLUSIVE = 'subtract';

  gstForm: any;
  title = 'all-calcs';
  itemValue: number = 100;
  gstValue: number = 9;
  gstResult = {
    netAmount: 0,
    gstAmount: 0,
    grossAmount: 0,
  };
  definedGstList = [5, 12, 18, 28];
  definedTaxCategoryList = [this.TAX_INCLUSIVE, this.TAX_EXCLUSIVE];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.gstForm = this.formBuilder.group({
      itemValue: [100, Validators.required],
      gstValue: [9, Validators.required],
      calcType: [this.TAX_INCLUSIVE, Validators.required],
    });

    this.gstForm.valueChanges.subscribe(() => {
      const {
        value: { itemValue, gstValue, calcType },
      } = this.gstForm;
      if (calcType === this.TAX_INCLUSIVE) {
        this.addGstValue(itemValue, gstValue);
      } else {
        this.removeGstValue(itemValue, gstValue);
      }
    });

    this.populateRandom();
  }

  public populateRandom() {
    this.gstForm.setValue({
      itemValue: this.getRandomNumberRange(1, 9999),
      gstValue: this.pickOneFromRandomlyFromList(this.definedGstList),
      calcType: this.pickOneFromRandomlyFromList(this.definedTaxCategoryList),
    });
  }

  private addGstValue(itemValue: any, gstValue: any): void {
    const netAmount: any = parseFloat(itemValue);
    const gstAmount: any = (netAmount * parseFloat(gstValue)) / 100;
    const grossAmount: any = netAmount * gstAmount.toFixed(2);

    this.setGstResultValue(netAmount, gstAmount, grossAmount);
  }

  private removeGstValue(itemValue: any, gstValue: any): void {
    const grossAmount: any = parseFloat(itemValue);
    const netAmount: any =
      (100 * parseFloat(itemValue)) / (100.0 + parseFloat(gstValue));
    const gstAmount: any = parseFloat(grossAmount) - parseFloat(netAmount);

    this.setGstResultValue(netAmount, gstAmount, grossAmount);
  }

  private setGstResultValue(
    netAmount: any,
    gstAmount: any,
    grossAmount: any
  ): void {
    this.gstResult = {
      netAmount: netAmount.toFixed(2) || 0,
      gstAmount: gstAmount.toFixed(2) || 0,
      grossAmount: grossAmount.toFixed(2) || 0,
    };
  }

  private getRandomNumberRange(min: number, max: number): number {
    return Math.trunc(Math.random() * (max - min) + min);
  }

  private pickOneFromRandomlyFromList(
    list: Array<number | string>
  ): number | string {
    return list[Math.floor(Math.random() * list.length)];
  }
}
