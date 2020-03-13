import { NgModule } from '@angular/core';

import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { Ng5SliderModule } from 'ng5-slider';

/**
 * NgModule that includes all Material modules that are required to serve the app.
 */
@NgModule({
  exports: [ObserversModule, PlatformModule, MatIconModule, MatButtonModule, MatSliderModule, Ng5SliderModule],
})
export class MaterialModule {}
