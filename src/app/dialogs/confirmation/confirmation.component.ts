import {Component} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<ConfirmationComponent>) {}

  openLink(n): void {
    this._bottomSheetRef.dismiss(n);
  }
}