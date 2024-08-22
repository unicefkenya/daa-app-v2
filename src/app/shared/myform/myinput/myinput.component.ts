import { Component, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../../services/common-services/common.service'
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-myinput',
  templateUrl: './myinput.component.html',
  styleUrls: ['./myinput.component.scss']
})
export class MyinputComponent implements OnInit {
  @Input()
  formControName!: string

  @Input()
  form!: FormGroup
  errors: any = []
  @Input()
  data: any
  gender: "f"
  @Input()
  formErrors: any
  forceUpdate = false
  visible: boolean = true
  fromFieldChoices: any = [];
  choices: Array<any> = []
  intital: boolean = false
  isLoading: boolean = false
  constructor(
    private ngZone: NgZone,
    private storage: Storage,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  ionWillEnter() {
    console.log(`My INput check...`)
  }

  ngOnChanges() {
    this.setUpoptions()
    if (this.formControName) {
      this.sortValidationErrors()
    }
    if (this.data.from_field) {
      this.setUpFieldLiseteners()
    }
    // this.formControl.
  }
  get fromFieldControl() {
    if (this.data.from_field) {
      return this.form.get(this.data.from_field)
    }
    return null
  }
  get fromFieldValue() {
    if (this.fromFieldControl)
      return this.fromFieldControl.value
    return null
  }
  setUpFieldLiseteners() {
    this.form.get(this.data.from_field)!.valueChanges.subscribe(data => {
      this.updateFromFieldChoices()
    })
    this.updateFromFieldChoices()
  }
  async setUpoptions() {
    if (this.form && this.formControName && !this.intital) {
      this.intital = true
      this.formControl.valueChanges.subscribe((val) => {
        this.sortValidationErrors(true)
      })


      // Check if its a field
      if (this.data.choices) {
        this.choices = this.data.choices
        if (this.data.from_field) {
          this.fromFieldChoices = this.data.choices
        }
      }
      else if (this.data.storage) {
        let theChoices = []
        const choices = await this.storage.get(this.data.storage)
        if (this.data.from_field) {
          this.fromFieldChoices = choices
          if (this.fromFieldValue && this.data.hasOwnProperty("from_field_source")) {
            theChoices = this.fromFieldChoices.find(parentChoice => parentChoice.id == this.fromFieldValue)[this.data.from_field_source]
          } else {
            theChoices = choices
          }
        } else {
          theChoices = choices
        }
        this.choices = theChoices.map((value: any) => {
          return {
            "value": value.id,
            "display_name": value[this.data.display_name]
          }
        });


      } else if (this.data.type == "field") {
        this.getUrlBasedOptions()
      }

    }
  }
  showLoader(status: boolean) {
    this.isLoading = status
  }
  hideShowOnFromField() {
    const showOnlyValue = this.data.show_only;
    const validators = [Validators.required]
    if (this.fromFieldValue == showOnlyValue) {
      this.formControl.setValidators(validators)
      this.visible = true
    } else {
      this.formControl.clearValidators()
      this.formControl.setValue(this.data.default || null)
      this.visible = false
    }
  }
  updateFromFieldChoices() {
    if (this.data.hasOwnProperty("show_only")) {
      this.hideShowOnFromField()
      return
    }

    if (!this.fromFieldValue) {
      this.showLoader(false)
      return
    }
    if (this.fromFieldChoices.length == 0) {
      this.choices = []
      return
    }
    this.ngZone.run(() => {
      this.choices = this.fromFieldChoices.find(parentChoice => parentChoice.id == this.fromFieldValue)[this.data.from_field_source].map((value: any) => {
        return {
          "value": value.id,
          "display_name": value[this.data.display_name]
        }
      });
    });
  }
  get placeholderText() {
    if (this.data.hasOwnProperty("placeholder"))
      return this.data.placeholder
    return ""
  }
  get isLoadingDisplay() {
    if (this.data.from_field) {
      const message = `Select the ${this.data.from_field.replace(/_/g, " ")} first`
      return message
    }
    return "Fetching..."
  }
  getUrlBasedOptions() {
    if (!this.data.url) return

    this.showLoader(true)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const url = `${API_URL}/${this.data.url}`
    this.http.get<any>(url, { headers: headers }).subscribe(res => {
      this.showLoader(false)
      let theChoices = []
      if (this.data.from_field) {
        this.fromFieldChoices = res.results
        if (this.fromFieldValue) {
          theChoices = res.results.find(parentChoice => parentChoice.id == this.fromFieldValue)[this.data.from_field_source]
        }
      } else {
        theChoices = res.results
      }
      this.choices = theChoices.map((value: any) => {
        return {
          "value": value.id,
          "display_name": value[this.data.display_name]
        }
      });
    }, error => {
      this.showLoader(false)
      const status = error.status
    })
  }
  sortValidationErrors(clearFormError = false) {
    this.errors = []
    if (this.formControl.untouched) {
      return
    }

    //Clear the form errors on value changes only
    if (clearFormError) {
      delete this.formErrors[this.formControName]
    }

    // Normal formControl errors
    if (this.formControl.errors) {
      this.errors = Object.keys(this.formControl.errors)
    }

    // Check other form control errors from outside(from the backend)
    if (this.formControName in this.formErrors) {
      this.errors = this.errors.concat(this.formErrors[this.formControName])
    }

    // If the control is not marked as invalid force it
    if (this.errors.length > 0 && this.formControl.valid) {
      this.formControl.setErrors({ '': true })
    }

  }

  get formControl(): AbstractControl {
    return this.form.controls[this.formControName]
  }

  get isRequired() {
    return this.data.required
  }

  get formControlType(): string {
    if (this.data.obscure) {
      return "password"
    }
    switch (this.data.type) {
      case 'integer':
        return "number"
        break;
      case 'string':
        if (this.data.max_length && this.data.max_length > 300) {
          return 'textArea'
        }
        return "text"
        break;
      case 'datetime':
        return "datetime-local"
        break;
      case 'date':
        return "date"
        break;
      case 'time':
        return "time"
        break;
      case 'field':
        if (this.data.multiple) {
          return 'multiplechoice'
        }
        return "choice"
        break;
      default:
        return this.data.type
        break;
    }
  }

  get displayControlName() {
    return this.data.label //this.formControName.replace("_", " ")
  }

  get controlValue() {
    // console.log(this.formControl.value)
    return this.formControl.value
  }

  download() {
    console.log(this.controlValue)
    fetch(this.controlValue, { method: 'GET', mode: 'no-cors' })
      .then(resp => {
        console.log(resp)
        return resp.blob()
      })
      .then(blob => {
        console.log("blob")
        console.log(blob)
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = 'image.jpg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        //  headers.append('Access-Control-Allow-Origin', 'http://localhost:8100');
        //  headers.append('Access-Control-Allow-Credentials', 'true');
      })
      .catch(() => alert('Download failed!'));
  }

  openimage() {
    console.log(this.controlValue)
  }




}
