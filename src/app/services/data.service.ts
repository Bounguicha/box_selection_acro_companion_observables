import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { KeyButton } from '../interfaces/key-button';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Manages the index of the currently selected box.
  private _selectedBoxIndex = new BehaviorSubject<number | null>(null);

  // Observable stream for the currently selected box index.
  public selectedBoxIndex$ = this._selectedBoxIndex.asObservable();

  // Tracks box-specific subjects to handle updates for each box.
  private _boxSubjects = new Map<number, Subject<KeyButton>>();

  // Stores key-button values associated with each box.
  private _boxSums = new Map<number, KeyButton>();

  // Represents the list of boxes.
  private _boxList = Array(10);

  // Provides access to the list of boxes.
  get boxes(): Array<Object> {
    return this._boxList;
  }

  // Provides access to the map holding box values and sums.
  get boxValuesSumMap(): Map<number, KeyButton> {
    return this._boxSums;
  }

  // Provides access to the map holding subjects for each box.
  get boxSubjects(): Map<number, Subject<KeyButton>> {
    return this._boxSubjects;
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
  public getBoxSubject(index: number): Subject<KeyButton> {
    if (!this._boxSubjects.has(index)) {
      this._boxSubjects.set(index, new Subject<KeyButton>());
    }
    return this._boxSubjects.get(index)!;
  }

  /**
   * Updates the key-button value for a specific box and stores it in `_boxSums`.
   * This data is also persisted in `localStorage`.
   * @param index - Index of the box to update.
   * @param keyButton - Key-button value to assign to the box.
   */
  public updateBoxValue(index: number, keyButton: KeyButton): void {
    // Emits the new value through the associated box subject.
    const boxSubject = this.getBoxSubject(index);
    boxSubject.next(keyButton);

    // Updates the storage for box values and persists the state to `localStorage`.
    if (keyButton.key) {
      this._boxSums.set(index, keyButton);
      const serializedData = JSON.stringify(Array.from(this._boxSums.entries()));
      localStorage.setItem('boxData', serializedData);
    }
  }

  /**
   * Clears all box data, including subjects, value maps, and local storage data.
   */
  public clearBoxValues(): void {
    this.boxSubjects.clear();
    this.clearSelectedIndex();
    this.boxValuesSumMap.clear();
    localStorage.clear();
  }
}
