import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { DatabaseService, User } from './../../services/database.service';
import { NavigationExtras, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
 base64 = 'data:image/png;base64,';
  userData = {};
  usersT:  User[] = [];
  tipo: any;

  constructor(private toast: ToastController, private router: Router, private db: DatabaseService, private formBuilder: FormBuilder,
              private auth: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getUsers().subscribe(usuarios => {
          this.usersT = usuarios;
          console.log(this.usersT);
        });
      }
    });
    this.http.get(`https://bio01.qaingenieros.com/api/enrol/get-tipos?apiKey=cfdc7593-7124-4e9e-b078-f44c18cacef4`).subscribe((res: any) => {
     console.log(res);
     this.tipo = res.data;
     console.log(this.tipo);
    });
  }
 
  datasForm = this.formBuilder.group({
    FirstName: ['', [Validators.required]],
    LastName: ['', [Validators.required]],
    tipo_documento: ['', [Validators.required]],
    documento: ['', [Validators.required]]
  });

  sendUser(){
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.userData
      }
    };
    this.router.navigate(['bioseguridad'], navigationExtras);
    this.userData = {};
  }
  logOut(){
    this.auth.logout();
   }
}
