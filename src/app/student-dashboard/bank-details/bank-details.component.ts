import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpWrapperService } from '../../services/api-service.service';
import { Api } from '../../services/api-enums';

@Component({
  selector: 'app-bank-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './bank-details.component.html',
  styleUrl: './bank-details.component.css'
})
export class BankDetailsComponent implements OnInit {
  bankForm!: FormGroup;
  isGlobalUser: boolean = false;
  userHaveAccount: boolean=false;
  constructor(private fb: FormBuilder, private ApiService: HttpWrapperService) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user?.country_code == 'IN') {
      this.isGlobalUser = false;
    }
    else {
      this.isGlobalUser = false;
    }
    
    this.buildForm();
    this.prefillBankData(); // ✅ auto fill if user already saved
  }

  buildForm() {
    this.bankForm = this.fb.group({
      fullName: ['', [Validators.required, this.noSpaceValidator()]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      confirmAccountNumber: ['', Validators.required],
      ifsc: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      bankName: [''],
      branch: [''],
      accountType: ['savings', Validators.required],
      upiId: ['', this.conditionalNoSpaceValidator()],

      // Global fields: Optional for Indian users
      swiftCode: ['', this.conditionalNoSpaceValidator()],
      iban: ['', this.conditionalNoSpaceValidator()],
      country: ['', this.conditionalNoSpaceValidator()],
      currency: ['', this.conditionalNoSpaceValidator()],
      paypalEmail: ['', this.conditionalNoSpaceValidator()],
    }, { validators: this.matchAccountNumbers });

  }
  conditionalNoSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; // allow empty values
      const isValid = control.value?.trim().length > 0 && !/\s{2,}/.test(control.value);
      return isValid ? null : { noSpace: true };
    };
  }

  noSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value?.trim().length > 0 && !/\s{2,}/.test(control.value);
      return isValid ? null : { noSpace: true };
    };
  }

  matchAccountNumbers(form: FormGroup): ValidationErrors | null {
    const acc = form.get('accountNumber')?.value;
    const confirm = form.get('confirmAccountNumber')?.value;
    return acc === confirm ? null : { accountMismatch: true };
  }

  fetchBankDetails() {
    let ifsc = this.bankForm.get('ifsc')?.value;

    if (ifsc) {
      ifsc = ifsc.trim().toUpperCase(); // clean and uppercase

      this.ApiService.get(`api/user/ifsc/${ifsc}`).subscribe({
        next: (data: any) => {
          this.bankForm.patchValue({
            bankName: data.BANK || '',
            branch: data.BRANCH || ''
          });
        },
        error: () => {
          alert('Invalid IFSC Code');
          this.bankForm.patchValue({ bankName: '', branch: '' });
        }
      });
    }
  }


  prefillBankData() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const userId = user?._id
    this.ApiService.get(`${Api.getBankDetails}/${userId}`).subscribe((res: any) => {
      if (res?.Status == 200) {
        this.userHaveAccount=true;
        this.bankForm.patchValue({

          branch: res?.data.branch || '',
          accountNumber: res?.data.accountNumber || '',
          fullName: res?.data?.fullName,
          confirmAccountNumber: res?.data.accountNumber || '',
          ifsc: res?.data?.ifsc,
          bankName: res?.data?.bankName,
          country: res?.data?.country,
          currency: res?.data?.currency,
          paypalEmail: res?.data?.paypalEmail,
          swiftCode: res?.data?.swiftCode,
          iban: res?.data?.iban,
          upiId: res?.data?.upiId,
          accountType: res?.data?.accountType
        })
        this.bankForm.disable()
      }

    })


  }

  submitBankDetails() {
    if (this.bankForm.valid) {
      const payload = {
        ...this.bankForm.value,
        userId: JSON.parse(sessionStorage.getItem('user') || '{}')._id
      };
      this.ApiService.post(Api.saveBankDetails, payload).subscribe((res: any) => {
        alert(res.message);
        this.prefillBankData()
      });
    } else {
      alert('Please check form errors');
    }
  }
}
