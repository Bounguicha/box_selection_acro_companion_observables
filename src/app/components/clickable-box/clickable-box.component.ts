import { Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import { NgClass } from '@angular/common';
import { DataService } from '../../services/data.service';
import {merge, Subject, takeUntil} from 'rxjs';
import {KeyButton} from "../../interfaces/key-button";

@Component({
  selector: 'app-clickable-box',
  standalone: true,
  templateUrl: './clickable-box.component.html',
  imports: [NgClass],
  styleUrl: './clickable-box.component.scss',

})
export class ClickableBoxComponent implements OnInit, OnDestroy {

  // Input property specifying the index of the clickable element
  @Input() index: number = 0;

  // Holds the selected box index
  selectedIndex: number | null = null;

  public value: string = '';
  public key: number = 0;

  private destroy$ = new Subject<void>();

  public dataService = inject(DataService)
  constructor() {}


  ngOnInit(): void {
    this.subscribeToBoxUpdates();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles the click event on the clickable element.
   * Updates the selected box index in the data service.
   */
  public onElementClick(): void {
    this.dataService.selectBox(this.index);
  }

  /**
   * Subscribes to updates from the data service related to a specific box
   * and the currently selected box index. Merges these updates into a single stream
   * and handles them accordingly.
   */
  private subscribeToBoxUpdates(): void {
    const boxUpdates$ = this.dataService
      .getBoxSubject(this.index)
      .pipe(takeUntil(this.destroy$));

    const selectedIndexUpdates$ = this.dataService.selectedBoxIndex$.pipe(
      takeUntil(this.destroy$)
    );

    merge(boxUpdates$, selectedIndexUpdates$).subscribe({
      next: (update: number | KeyButton | null) => {
        if (typeof update === 'object') {
          this.handleBoxValueUpdate(update!); // Update key-value pair
        } else {
          this.selectedIndex = update as number; // Update selected index
        }
      },
    });
  }

  /**
   * Updates the key and value properties based on the incoming box values
   * @param boxValue - Array containing key-value pair (number, string)
   */
  private handleBoxValueUpdate(boxValue: KeyButton): void {
    this.value = boxValue?.output;
    this.key = boxValue?.key;
  }
}
