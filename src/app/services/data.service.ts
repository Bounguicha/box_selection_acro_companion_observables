import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, Subject} from 'rxjs';
import {BUTTON_CATEGORIES_MAP} from '../constants/button-config';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Manages the index of the currently selected box.
  private _selectedBoxIndex = new BehaviorSubject<number | null>(null);

  // Observable stream for the currently selected box index.
  public selectedBoxIndex$ = this._selectedBoxIndex.asObservable();

  // Tracks box-specific subjects to handle updates for each box.
  private _boxSubjects = new Map<number, Subject<number>>();


  // Observable map to manage key-button sums for boxes.
  private _boxSums$ = new BehaviorSubject<Map<number, number>>(new Map());
  public boxSums$: Observable<Map<number, number>> = this._boxSums$.asObservable();

  public totalSum$: Observable<number> = this.boxSums$.pipe(
    map((boxValues) =>
      Array.from(boxValues.values()).reduce((sum, value) => sum + value, 0)
    )
  );


  // Stores key-button values associated with each box.

  // Represents the list of boxes.
  private _boxList = Array(10).fill(null);

  get boxes(): Array<Object> {
    return this._boxList;
  }

  get boxValuesSumMap(): Map<number, number> {
    return this._boxSums$.getValue(); // Access the current value of the BehaviorSubject
  }



  /**
   * Retrieves the output value for a given key.
   * @param key - The key of the button to search for.
   * @returns The output associated with the button key, or `null` if not found.
   */
  public getButtonOutputByKey(key: number): string | null {
    for (const buttonList of BUTTON_CATEGORIES_MAP.values()) {
      const foundButton = buttonList.find((button) => button.key === key);
      if (foundButton) {
        return foundButton.output;
      }
    }
    return null;
  }



  constructor() {}

  /**
   * Updates the currently selected box index and notifies subscribers.
   * @param index - Index of the box to be selected.
   */
  public selectBox(index: number): void {
    if (index < this._boxList.length) {
      this._selectedBoxIndex.next(index);
    }
  }

  /**
   * Clears the selected box index and resets it to `null`.
   */
  public clearSelectedIndex(): void {
    this._selectedBoxIndex.next(null);
  }

  /**
   * Retrieves or initializes a subject for managing updates of a specific box.
   * @param index - Index of the box.
   * @returns The subject associated with the specified box index.
   */
  public getBoxSubject(index: number): Subject<number> {
    if (!this._boxSubjects.has(index)) {
      this._boxSubjects.set(index, new Subject<number>());
    }
    return this._boxSubjects.get(index)!;
  }

  public clearBoxSubjects(): void {
    this._boxList.forEach((_, index) => {
      const subject = this._boxSubjects.get(index);
      if (subject) {
        subject.next(0); // Emit a reset value or any placeholder
      }
    });
  }

  /**
   * Updates the key-button value for a specific box and stores it in `_boxSums`.
   * This data is also persisted in `localStorage`.
   * @param index - Index of the box to update.
   * @param keyButton - Key-button value to assign to the box.
   */
  public updateBoxValue(index: number, keyButton: number): void {
    // Emits the new value through the associated box subject.
    const boxSubject = this.getBoxSubject(index);
    boxSubject.next(keyButton);

    // Updates the storage for box values and persists the state to `localStorage`.
    if (keyButton) {
      const updatedBoxSums = this._boxSums$.getValue();
      updatedBoxSums.set(index, keyButton);
      this._boxSums$.next(new Map(updatedBoxSums)); // Emit updated map
      const serializedData = JSON.stringify(Array.from(updatedBoxSums.entries()));
      localStorage.setItem('boxData', serializedData);

    }
  }

  /**
   * Clears all box data, including subjects, value maps, and local storage data.
   */
  public clearBoxValues(): void {
    this.clearBoxSubjects();
    this.clearSelectedIndex();
    this._boxSums$.next(new Map());
    localStorage.clear();
  }

  /**
   * Computes the sum of all key values associated with stored boxes.
   * @returns Total sum of box key values.
   */
  public calculateTotalSum(): number {
    return Array.from(this.boxValuesSumMap.values()).reduce((acc, value) => acc + value, 0);
  }
}
