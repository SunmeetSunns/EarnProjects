import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbDatepickerModule, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpWrapperService } from '../../services/api-service.service';
import { Api } from '../../services/api-enums';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [NgbModule, CommonModule,
    FormsModule, NgbDatepickerModule
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {
  Myuser: any;
  showToast: boolean;
  dangerText: String = '';
  successText: String = '';
  ngOnInit(): void {
    this.populateUserDetails()
  }
  isEditingProfile = false;
  isEditingEmail = false;
  isEditingPortfolio = false;
  isEyeClose = true;
  user = {
    fullName: '',
  };

  newEmail = '';
  otp = '';
  otpSent = false;

  passwords = {
    old: '',
    new: '',
    confirm: ''
  };

  profileImage!: File;
  resumeFile!: File;
  externalPortfolio = '';

  subscription = {
    plan: 'Student'
  };

  selectedDate: Date | null = null;

  constructor(private http: HttpClient, private calendar: NgbCalendar, private ApiService: HttpWrapperService) { }

  updateProfile() {
    this.isEditingProfile = false
    const payload = { fullName: this.user.fullName };
    this.http.post('/api/user/update-profile', payload).subscribe(console.log);
  }

  sendOtp() {
    let body = {
      email: this.newEmail, purpose: 'update'
    }
    this.ApiService.post(Api.sendOtp, body).subscribe((res: any) => {
      this.otpSent = true;
    })

  }

  verifyAndUpdateEmail() {
    let body = {
      email: this.newEmail,
      otp: this.otp
    }
    this.ApiService.post(Api.verifyOtp, body).subscribe((res: any) => {

      let req = {
        newEmail: this.newEmail,
        userId: this.Myuser?._id
      }
      if (res?.status == 200) {
        this.ApiService.post(Api.updateEmail, req).subscribe((res: any) => {
          this.isEditingEmail = false;
          this.newEmail = '';
          this.otp = '';
          this.otpSent = false;
          this.isEditingEmail = false
          this.Myuser = res?.user
          sessionStorage.setItem('user', JSON.stringify(this.Myuser))
          this.populateUserDetails();
        })

      }
    })
  }
  toggleEye() {
    this.isEyeClose = !this.isEyeClose
  }
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  populateUserDetails() {
    this.Myuser = JSON.parse(sessionStorage.getItem('user'))
    this.user.fullName = this.Myuser?.name;
    this.newEmail = this.Myuser?.email;
    this.externalPortfolio = this.Myuser?.portfolio;
    this.subscription.plan = this.Myuser?.plan;
    this.profileImage = this.Myuser?.profilePic?.url;
    this.resumeFile = this.Myuser?.resume?.url;
    this.passwords = {
      old: this.Myuser?.unhashedPassword,
      new: "",
      confirm: ""
    };

  }
  isDisabled = (date: NgbDateStruct, current: { month: number }) => {
    const today = this.calendar.getToday();

    // Disable past dates
    const isPast = date.year < today.year ||
      (date.year === today.year && date.month < today.month) ||
      (date.year === today.year && date.month === today.month && date.day < today.day);

    // Disable Sat (6) and Sun (7)
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const isWeekend = jsDate.getDay() === 0 || jsDate.getDay() === 6; // 0 = Sunday, 6 = Saturday

    return isPast || isWeekend;
  };

  changePassword() {
    const { old, new: newPass, confirm } = this.passwords;
    if (newPass !== confirm) {
      alert('Passwords do not match');
      return;
    }
    this.http.post('/api/user/change-password', {
      currentPassword: old,
      newPassword: newPass
    }).subscribe(console.log);
  }


  uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, JPEG, PNG formats allowed for profile picture.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    this.ApiService.put(Api.uploadUserFiles(this.Myuser?._id), formData)
      .subscribe({
        next: (res: any) => {
          this.successText='Profile picture uploaded successfully';
          this.profileImage= res.profilePic;
        },
        error: (err) => {
         this.dangerText='Profile pic upload failed';
        }
      });
      this.showSuccessToast()
  }

  uploadResume(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Only PDF, DOC, DOCX formats allowed for resume.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    this.ApiService.put(Api.uploadUserFiles(this.Myuser?._id), formData).subscribe({
      next: (res: any) => {
        this.successText='Resume uploaded successfully'
        this.resumeFile=res?.resume;
      },
      error: (err) => {
        this.dangerText='Resume upload failed'
        console.error(err);
      }
      
    });
    this.showSuccessToast()

  }
  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 9000);
  }
  savePortfolio() {
    const formData = new FormData();
    if (this.resumeFile) formData.append('resume', this.resumeFile);
    if (this.externalPortfolio) formData.append('portfolioLink', this.externalPortfolio);
    this.http.post('/api/user/upload-portfolio', formData).subscribe(console.log);
  }

  upgrade() {
    this.http.post('/api/user/upgrade-plan', {}).subscribe(console.log);
  }

  cancel() {
    this.http.post('/api/user/cancel-plan', {}).subscribe(console.log);
  }

  bookMeeting() {
    if (!this.selectedDate) return;
    this.http.post('/api/user/book-meeting', { date: this.selectedDate }).subscribe(console.log);
  }
}
