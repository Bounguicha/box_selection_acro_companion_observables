import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject, OnDestroy,
  OnInit,
} from '@angular/core';
import { BUTTON_CATEGORIES_MAP } from '../../constants/button-config';
import { BUTTON_CATEGORIES } from '../../enums/enums';
import { MatButton } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { KeyButton } from '../../interfaces/key-button';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-key-pad',
  imports: [MatButton],
  templateUrl: './key-pad.component.html',
  standalone: true,
  styleUrls: ['./key-pad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyPadComponent implements OnInit, OnDestroy {
  // Contains the list of all buttons per category
  protected buttonList: Map<BUTTON_CATEGORIES, KeyButton[]> = BUTTON_CATEGORIES_MAP;

  // List of all categories
  protected buttonCategories: BUTTON_CATEGORIES[] = Object.values(BUTTON_CATEGORIES);

  // Current box index being worked on
  protected index: number = 0;

  // Stores the key of the last clicked button
  protected clickedButton = 0;

  public dataService = inject(DataService);

  private destroy$ = new Subject<void>();


  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Subscribes to the selected box updates and synchronizes the state of the keypad.
   */
  ngOnInit(): void {
    this.dataService.selectedBoxIndex$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((index) => {
      this.index = index!;
      this.clickedButton = this.dataService.boxValuesSumMap.get(this.index) ?? 0;
      this.cdr.markForCheck(); // Ensures the component is updated
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles button click events. Updates the box value and moves to the next box.
   * @param keyButton - Represents details of the clicked button.
   */
  onButtonClick(keyButton: number): void {
    this.clickedButton = keyButton;
    this.dataService.updateBoxValue(this.index, keyButton); // Update the box value
    this.dataService.selectBox(this.index + 1); // Proceed to the next box
  }
}
