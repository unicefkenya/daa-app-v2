import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { MY_EXAMPLE_OPTIONS_DATA } from './myfields';
import { MyInputModel, InputType } from './myinput/model';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/services/common-services/common.service';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: 'Bearer micha'
})
@Component({
  selector: 'app-myform',
  templateUrl: './myform.component.html',
  styleUrls: ['./myform.component.scss']
})
export class MyformComponent implements OnInit {
  _instance: any

  @Input()
  formGroup: FormGroup = new FormGroup({});

  @Input()
  submitButtonText: string = "Post"

  @Input()
  submitButtonPreText: string = null

  @Input()
  formItems: any

  @Input()
  formActionName!: string

  instanceChanged: boolean = false
  isNew: boolean = true;

  @Input()
  doUpdate = false;

  @Input()
  extraFields: any

  @Input()
  httpMethod: any = ""

  @Input()
  set instance(value: any) {
    this._instance = value
    this.instanceChanged = true
    console.log("Daam setting the instance")
    console.log(value)
  }

  get instance() {
    return this._instance
  }

  @Output()
  onValidatedData = new EventEmitter<any>();

  @Input()
  preSaveDataFunction: Function;

  @Output()
  onPostedData = new EventEmitter<any>();

  @Output()
  isLoading$ = new EventEmitter<boolean>();

  @Input()
  isValidationOnly: boolean = false

  @Input()
  set url(value) {
    this._url = value
  }

  get url() {
    return `${API_URL}/${this._url}`
  }

  _url: any


  @Input()
  readOnly = false;

  @Input()
  hideButtons = false

  @Input()
  formGroupOrder!: Array<Array<string>>;
  _settingUpFormDone = false
  initial: boolean = false
  formErrors: any = {}
  detailErrors: any = []
  isLoading: boolean = false
  constructor(private fb: FormBuilder,
    private http: HttpClient) {

  }
  ngOnInit(): void {
    console.log("On intit...")
    this.formGroup.valueChanges.subscribe(from => {
      console.log(Object.keys(from).length)
    })
    if (this.formGroupOrder) {
      const controls = this.formGroup.controls
      this.initial = false
      const fields = this.formItems.actions.POST;
      const possibleFields = this.formGroupOrder.reduce((acc, val) => acc.concat(val), [])
      for (let control in controls) {
        if (!possibleFields.includes(control))
          this.formGroup.removeControl(control)
      }
      for (var index in possibleFields) {
        const key = possibleFields[index]
        const field = fields[key] || {
          read_only: false,
          label: key.replace(/_/g, " "),
          name: key,
          options: {},
          type: "string",
          customField: true,
          required: false
        }

        // Adding the custom fields 
        if ("customField" in field) {
          this.formItems.actions.POST[key] = field
        }

        const myinputfield = MyInputModel.fromJson(key, field);

        if (field.read_only) {
          continue
        }

        const defaultField = field.type == "boolean" ? field.default || false : field.default || null
        this.formGroup.addControl(
          key, new FormControl(defaultField, [
          ])
        )
        const fieldcontrol = this.formGroup.controls[key]


        if (this.readOnly) {
          fieldcontrol.disable()
        }
        const validators = []
        if (field.required) {
          validators.push(Validators.required)
        }
        if (field.max_length) {
          validators.push(Validators.maxLength(field.max_length))
        }
        if (validators.length > 0) {
          fieldcontrol.setValidators(validators)
        }

      }
    }
    this._settingUpFormDone = true
    this.checkInstanceChangesUpdateForm()
  }

  updateFormStuff(val) {
    console.log(`updateValueAndValidity`)
  }

  ngOnChanges() {
    // this.checkInstanceChangesUpdateForm()
  }

  checkInstanceChangesUpdateForm() {
    if (!this._settingUpFormDone) return
    if (this.instanceChanged) {
      this.instanceChanged = false
      if (this.instance) {

        setTimeout(() => {
          this.formGroup.patchValue(
            this.instance
          )
        }, 500)

        this.isNew = this.instance.id == null
        this.formGroup.markAsTouched()
      }
    }
  }

  getDescriptionObject(formControlName: string) {
    return this.formItems.actions.POST[formControlName];
  }

  getFieldNameErros(formControlName: string) {
    return this.formErrors[formControlName]
  }


  showLoader(status: boolean) {
    this.isLoading = status
    this.isLoading$.emit(status)
  }


  dataReceived() {
    this.detailErrors = []
    if (this.formGroup.valid) {
      let data = this.formGroup.value
      if (this.extraFields) {
        data = { ...data, ...this.extraFields }
      }

      if (this.preSaveDataFunction) {
        data = this.preSaveDataFunction(data)
      }
      if (this.isValidationOnly) {
        this.onValidatedData.emit(data)
      } else {
        this.sendDataHttp(data)
      }
    } else {
    }
  }

  get myFormValid(): boolean {
    return this.formGroup.valid
  }

  get formAction() {
    if (this.formActionName)
      return this.formActionName
    if (this.submitButtonPreText != null)
      return this.submitButtonPreText
    return this.isNew ? 'Add' : 'Update'
  }

  removeNullFields(data) {
    const cleanData = {}
    for (const key in data) {
      if (data[key] !== null) {
        cleanData[key] = data[key]
      }
    }
    return cleanData
  }

  sendDataHttp(data: any) {
    this.showLoader(true)
    this.formErrors = []
    let request: Observable<any>;
    if (this.httpMethod == "PUT") {
      request = this.http.put<any>(this.url, this.removeNullFields(data), { headers: headers })
    }
    else if (!this.isNew || this.doUpdate) {
      const url = this.doUpdate ? this.url : `${this.url}${this.instance.id}`
      request = this.http.patch<any>(url, this.removeNullFields(data), { headers: headers })
    } else {

      request = this.http.post<any>(this.url, this.removeNullFields(data), { headers: headers })
    }

    request.subscribe(res => {
      this.formGroup.reset()
      this.onPostedData.emit(res)
      this.showLoader(false)

    }, error => {
      this.showLoader(false)
      const status = error.status
      if (status == 401) {
        this.detailErrors.push("Login required.")
      } else if (status == 400) {
        const formErrors = error.error;
        if ("detial" in formErrors) {
          this.detailErrors.push(formErrors.detial)
        }
        this.formErrors = formErrors
      }
    })
  }

  getControl(name: string): AbstractControl {
    return this.formGroup.get(name) || new FormControl()
  }

}
