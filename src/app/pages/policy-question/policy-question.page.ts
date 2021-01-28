// Libs
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import * as moment from 'moment';

// DataBase
import { DatabaseService } from '@services/database.service';

// Models
import PolicyQuestion, { PolicyQuestionRServer } from '@models/policyQuestion';

// Services
import PolicyQuestionProvider from '@services/api/policyQuestion';

// Constants
import { TIME_ANIMATION_GENERAL } from '@constantsAPP';

const URL_PATH = 'src/app/pages/policy-question/policy-question.page.ts';

@Component({
  selector: 'app-policy-question',
  templateUrl: './policy-question.page.html',
  styleUrls: ['./policy-question.page.scss'],
})
export class PolicyQuestionPage implements OnInit {
  @ViewChild('containerPolicyQuestion', { read: ElementRef }) containerPolicyQuestion: ElementRef;
  @ViewChild('headerPolicyQuestion', { read: ElementRef }) headerPolicyQuestion: ElementRef;
  @ViewChild('titleQuestion', { read: ElementRef })  titleQuestion: ElementRef;
  @ViewChild('descriptionQuestion', { read: ElementRef }) descriptionQuestion: ElementRef;
  @ViewChild('versionQuestion', { read: ElementRef }) versionQuestion: ElementRef;

  /**
   * los dimensiones del logo ecopetrol se adapta al size de la pantalla del
   * dispositivo
   */
  styleSvgs: {
    widthLogo: number;
    heightLogo: number;
  };

  /**
   * preguntas de las políticas
   */
  questions: Array<PolicyQuestion>;
  /**
   * pregunta de la política actual donde esta el usuario
   */
  questionCurrent: PolicyQuestion | undefined;
  /**
   * index
   */
  index: number;
  /**
   * valida si esta habilitado el botón de envió de data al siguiente screen
   */
  isDisableSendData: boolean;
  /**
   * data del usuario pasada atreves de los parámetros de navegación.
   */
  user: any;
  /**
   * data que se envia al siguiente screen para se evaluada.
   */
  userData: {
    FirstName: string;
    LastName: string;
    tipo_documento: string;
    documento: number | string;
    policyQuestions: PolicyQuestion[];
    badgeId: string;
    imageUrl: string;
    metaDatos: any;
    empresa: string;
  };
  /**
   * version de la app
   */
  appV: string | number;
  /**
   * identificador único del dispositivo
   */
  uniqueDeviceId: string | number;

  constructor(private router: Router, private route: ActivatedRoute, private alertCtrl: AlertController,
              private animationCtrl: AnimationController, private appVersion: AppVersion, private db: DatabaseService,
              private udid: UniqueDeviceID) {
    this.questions = [];
    this.questionCurrent = undefined;
    this.index = 0;
    this.isDisableSendData = true;
    this.styleSvgs = {
      widthLogo: window.innerWidth / 2,
      heightLogo: (window.innerWidth / 2) / 2.5
    };
  }

  // Start lifecycle events
  ngOnInit() {
    this.appVersion.getVersionNumber().then(versionNumber => {
      this.appV = versionNumber;
      console.log(URL_PATH, 'ngOnInit()', 'this.appV', this.appV);
    });

    this.udid.get().then((uuid: any) => {
      this.uniqueDeviceId = uuid;
      console.log(URL_PATH, 'ngOnInit()', 'this.uniqueDeviceId', this.uniqueDeviceId);
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
        // console.log(URL_PATH, 'ngOnInit()', 'this.user', this.user);
        // Se recomienda manejar esto con una clase o una interfaz
        this.userData = {
          FirstName: this.user.FirstName,
          LastName: this.user.LastName,
          tipo_documento: this.user.tipo_documento,
          documento: this.user.documento,
          policyQuestions: [],
          badgeId: '',
          imageUrl: '',
          metaDatos: {},
          empresa: 'Ecopetrol'
        };
        // console.log(URL_PATH, 'ngOnInit()', 'this.userData', this.userData);
      }
    });

    this.loadQuestions();
  }

  ionViewWillEnter() {
    this.entranceAnimation();
  }

  ionViewWillLeave() {
    this.exitAnimation();
  }
  // End lifecycle events

  /**
   * @description carga las preguntas desde el servidor, que se le an de hacer
   * al enrolado.
   */
  async loadQuestions() {
    try {
      const { data, status } = await PolicyQuestionProvider.getPolicyEnrol();
      if (status === 200) {
        if (data.data.length) {
          this.questions = data.data.map((question: PolicyQuestionRServer) => new PolicyQuestion(PolicyQuestion.formatData(question)));
          this.questionCurrent = this.questions[this.index];
        }
      } else {
        console.log(URL_PATH, 'loadQuestions()', 'No fue posible obtener las respuestas');
      }
    } catch (err) {
        console.log(URL_PATH, 'loadQuestions()', 'err', err);
    }
  }

  /******************* Start funciones de animaciones ********************/
  /**
   * @description Se encarga de correr las animaciones de entrada de los
   * elementos
   */
  entranceAnimation() {
    if (this.containerPolicyQuestion && this.headerPolicyQuestion) {
      const headerUpAnimation = this.animationCtrl.create('animation-container-login')
        .addElement(this.headerPolicyQuestion.nativeElement)
        .keyframes([
          { offset: 0, transform: 'rotateY(90deg)' },
          { offset: 1, transform: 'rotateY(0deg)' }
        ]);

      const containerUpAnimation = this.animationCtrl.create('animation-container-login')
        .addElement(this.containerPolicyQuestion.nativeElement)
        .keyframes([
          { offset: 0, transform: 'rotateY(90deg)' },
          { offset: 1, transform: 'rotateY(0deg)' }
        ]);

      const animationUp = this.animationCtrl.create('animationUp')
        .addAnimation([ containerUpAnimation, headerUpAnimation ])
        .duration(TIME_ANIMATION_GENERAL)
        .easing('ease-in');

      animationUp.play();
    }
  }

  /**
   * @description Se encarga de correr las animaciones de salida de los
   * elementos
   */
  exitAnimation() {
    if (this.containerPolicyQuestion && this.headerPolicyQuestion) {
      const headerUpAnimation = this.animationCtrl.create('animation-header-login')
        .addElement(this.headerPolicyQuestion.nativeElement)
        .keyframes([
          { offset: 0, transform: 'rotateY(0deg)' },
          { offset: 1, transform: 'rotateY(90deg)' }
        ]);

      const containerUpAnimation = this.animationCtrl.create('animation-container-login')
        .addElement(this.containerPolicyQuestion.nativeElement)
        .keyframes([
          { offset: 0, transform: 'rotateY(0deg)' },
          { offset: 1, transform: 'rotateY(90deg)' }
        ]);

      const animationUp = this.animationCtrl.create('animationUp')
        .addAnimation([ containerUpAnimation, headerUpAnimation ])
        .duration(TIME_ANIMATION_GENERAL)
        .easing('ease-out');

      animationUp.play();
    }
  }

  /**
   * @description animación de entrada de la question
   */
  entranceQuestionAnimation() {
    if (this.titleQuestion && this.descriptionQuestion && this.versionQuestion) {
      const titleUpAnimation = this.animationCtrl.create('animation-title')
        .addElement(this.titleQuestion.nativeElement)
        .keyframes([
          { offset: 0, opacity: '0.5' },
          { offset: 1, opacity: '1' }
        ]);

      const descriptionUpAnimation = this.animationCtrl.create('animation-description')
        .addElement(this.descriptionQuestion.nativeElement)
        .keyframes([
          { offset: 0, opacity: '0.5' },
          { offset: 1, opacity: '1' }
        ]);

      const versionUpAnimation = this.animationCtrl.create('animation-description')
        .addElement(this.versionQuestion.nativeElement)
        .keyframes([
          { offset: 0, opacity: '0.5' },
          { offset: 1, opacity: '1' }
        ]);

      const animationUp = this.animationCtrl.create('animationUpQuestion')
        .addAnimation([ titleUpAnimation, descriptionUpAnimation, versionUpAnimation ])
        .duration(TIME_ANIMATION_GENERAL)
        .easing('ease-in');

      animationUp.play();
    }
  }
  /******************* End funciones de animaciones ********************/

  /**
   * @description maneja el cambio de index para saber cual pregunta renderizar.
   */
  handleIndex(action: boolean) {
    let index = this.index;

    if (action) {
      index += 1;
    } else {
      index -= 1;
    }

    this.index = index;
    this.questionCurrent = this.questions[index];
    this.entranceQuestionAnimation();
  }

  /**
   * @description maneja el cambio en las políticas de la pregunta.
   */
  handleAccept(event: CustomEvent) {
    let value: boolean | undefined;

    switch (event.detail.value) {
      case 'true':
        value = true;
        break;
      case 'false':
        value = false;
        break;
      default:
        value = undefined;
        break;
    }

    this.questionCurrent.handleAccept(value);
    this.questions[this.index].handleAccept(value);
    this.isDisableSendData = !this.questions.every((question) => question.data.accept !== undefined);
  }

  async alert(){
    const alert = await this.alertCtrl.create({
      cssClass: 'alerta1',
      header: 'Registramos su decisión, muchas gracias.',
      message: '<img src = "../../assets/images/avatar-profile.png" class="alertimg">',
      buttons: [{
        text: 'OK',
        cssClass: 'boton',
        handler: data => {
          console.log(URL_PATH, 'alert()', 'data', data);
        }
      }],
      mode: 'ios'
    });
    await alert.present();
  }

  /**
   * @description Envía la data a la siguiente screen para ser
   * procesada
   */
   processForm() {
    this.userData.policyQuestions = this.questions;
    const isAcceptAllPolicyQuestions = this.questions.every(question => question.data.accept === true);
    // this.userData.acepta_terminos = JSON.parse(this.terminos);
    if (isAcceptAllPolicyQuestions) {
      const navigationExtras: NavigationExtras = {
        state: {
          user: this.userData
        }
      };
      this.router.navigate(['private-data'], navigationExtras);
      console.log(URL_PATH, 'processForm()', 'this.userData', this.userData);
    } else {
      const fecha = moment().format('YYYY-MM-DD');
      const hora = moment().format('LTS');

      const metaDatos = {
        Fecha: fecha,
        Hora: hora,
        versionTxt: '0.1',
        Usuario_activo: 'Santiago',
        app_version: this.appV,
        udid: this.uniqueDeviceId
      };

      this.userData.metaDatos = JSON.stringify(metaDatos);

      // this.router.navigate(['user-data']);
      this.db
        .addUserData(
          this.userData.FirstName,
          this.userData.LastName,
          this.userData.tipo_documento,
          this.userData.documento,
          this.userData.policyQuestions,
          this.userData.badgeId,
          this.userData.imageUrl,
          this.userData.metaDatos,
          this.userData.empresa
        )
        .then((_) => {});

      this.alert();
      this.router.navigate(['user-data']);
      console.log(URL_PATH, 'processForm()', 'this.userData', this.userData);
    }
  }
}
