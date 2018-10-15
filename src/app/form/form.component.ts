import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import * as genres from './genres.json';
import * as instruments from './instruments.json';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private appService: AppService) {
  }

  public data;
  public songCount = 0;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  public form: FormGroup;

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;

  genres: any;
  instruments: any;
  instrumentTags = [];
  otherTags = [];
  subgenres: any;

  checkboxes = [
    {
      id: 'mood',
      label: 'How does this song make you feel? (Select all that apply)',
      bank: ['Angry', 'Depressed', 'Confused', 'Helpless', 'Indifferent', 'Afraid', 'Hurt', 'Sad', 'Judgmental', 'Open', 'Loving', 'Happy',
        'Interested', 'Alive', 'Positive', 'Peaceful', 'Strong', 'Relaxed'],
      checked: {}
    },
    {
      id: 'time',
      label: 'Does this song feel like it belongs to a certain time of day? (Select all that apply)',
      bank: ['Morning', 'Afternoon', 'Evening', 'After Hours'],
      checked: {}
    },
    {
      id: 'season',
      label: 'Does this song have a seasonal feel? (Select all that apply)',
      bank: ['Spring', 'Summer', 'Fall', 'Winter'],
      checked: {}
    },
    {
      id: 'category',
      label: 'What category of youtube video would this best fit?',
      bank: ['Auto & Vehicles', 'Beauty & Fashion', 'Comedy', 'Education', 'Entertainment', 'Family Entertainment', 'Film & Animation',
        'Food', 'Gaming', 'How-to & Style', 'Music', 'News & Politics', 'Nonprofits & Activism', 'People & Blogs', 'Pets & Animals',
        'Science & Technology', 'Sports', 'Travel & Events'],
      checked: {}
    }
  ];

  ngOnInit() {
    this.genres = (<any>genres).default;
    this.instruments = (<any>instruments).default;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.data = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.data);

    this.form = this.fb.group({
      genre: ['', Validators.required],
      subgenre: ['', Validators.required],
      'city-country': ['', Validators.required],
      relatedartists: ['', Validators.required],
      activities: ['', Validators.required],
      concert: ['', Validators.required],
      repeatplay: ['', Validators.required]
    });
  }

  addTag(tag) {
    if (tag.value) {
      this.otherTags.push(tag.value);
    }
  }

  removeTag(i) {
    this.otherTags.splice(i, 1);
  }

  submitForm(formDirective) {
    for (const checkbox of this.checkboxes) {
      this.form.value[checkbox.id] = [];
      for (const key in checkbox.checked) {
        if (checkbox.checked.hasOwnProperty(key) && checkbox.checked[key]) {
          this.form.value[checkbox.id].push(key);
        }
      }
    }

    this.form.value.other = this.otherTags;
    const instrumentTags = [];
    for (const tag of this.instrumentTags) {
      instrumentTags.push(tag.name);
    }
    this.form.value.instruments = instrumentTags;

    this.appService.submitForm(this.form.value, this.data.songs[this.songCount].id).subscribe(() => {
      this.form.reset();
      formDirective.resetForm();
      this.otherTags = [];
      this.instrumentTags = [];
      this.songCount++;
    });
  }

  addInstrumentTag(tag) {
    this.instrumentTags.push(tag);
    this.myControl.setValue(null);
    for (let i = 0; i < this.instruments.length; i++) {
      if (this.instruments[i].name === tag.name) {
        this.instruments.splice(i, 1);
      }
    }
  }

  removeInstrumentTag(tag, index) {
    this.instruments.push(tag);
    this.instruments.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    this.instrumentTags.splice(index, 1);
  }

  private _filter(value: string): any[] {
    if (value == null) {
      return;
    }
    const filterValue = value.toLowerCase();

    return this.instruments.filter(option => option.name.toLowerCase().includes(filterValue)).sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }

}
