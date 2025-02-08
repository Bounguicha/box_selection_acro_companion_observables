import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { DataService } from '../../services/data.service';
import { KeyPadComponent } from '../key-pad/key-pad.component';
import { ClickableBoxComponent } from '../clickable-box/clickable-box.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    KeyPadComponent,
    ClickableBoxComponent,
    MatIcon,
    MatMiniFabButton,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
  public dataService = inject(DataService);

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Loads previously stored box data from `localStorage` and updates the data service with the values.
   */
  ngAfterViewInit(): void {
    const storedBoxValues: Array<Array<number>> = JSON.parse(
      localStorage.getItem('boxData')!
    );

    storedBoxValues?.forEach((value) => {
      this.dataService.updateBoxValue(
        value[0],
        value[1]
      );
      this.cdr.detectChanges(); // Updates the component tree
    });
  }

  /**
   * Completely resets the box values in the data service and clears the local application data.
   */
  public resetBoxValues(): void {
    this.dataService.clearBoxValues(); // Clears all stored box data
  }


}
