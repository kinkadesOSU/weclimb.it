import { Component, ElementRef, EventEmitter, Output, ViewChild, HostListener } from '@angular/core';
import { GeoService, PlaceSuggestion } from 'src/app/services/geo.service';
import { GeoLocation } from 'src/app/classes/geolocation.class';

const MIN_PLACES_QUERY_LEN = 3;
const MAX_PLACES_RESULTS = 10;

export interface SearchOptions {
  query: string;
  minWeather?: number;
  maxWeather?: number;
  minPosition?: number;
  maxPosition?: number;
  minDifficulty?: number;
  maxDifficulty?: number;
}

@Component({
  selector: 'wci-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
  @Output() search: EventEmitter<SearchOptions> = new EventEmitter<SearchOptions>();
  @Output() queryChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() suggestionSelected: EventEmitter<PlaceSuggestion> = new EventEmitter<PlaceSuggestion>();
  @Output() optionsUpdated: EventEmitter<SearchOptions> = new EventEmitter<SearchOptions>();
  @ViewChild('search') public searchElementRef: ElementRef;

  ENTER_KEY = 13;

  showSettings = false;
  showSuggestions = false;
  suggestedPlaces: PlaceSuggestion[] = [];
  minWeatherCoeff = 0;
  maxWeatherCoeff = 1;
  minDistanceCoeff = 0;
  maxDistanceCoeff = 1;
  minDifficultyCoeff = 0;
  maxDifficultyCoeff = 1;
  query: string = null;
  sliderOptions = {
    floor: 0,
    ceil: 1,
    step: 0.05,
    showSelectionBar: false,
    showTicks: false,
    animate: false,
  };

  constructor(private geoService: GeoService, private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
      this.showSettings = false;
    } else {
      this.showSuggestions = true;
    }
  }

  /**
   *
   */
  onQueryChanged(query: string): void {
    this.queryChanged.emit(query);
    this.geoService
      .getPlaces(query, MIN_PLACES_QUERY_LEN, MAX_PLACES_RESULTS)
      .then((res: PlaceSuggestion[]) => ((this.showSuggestions = true), (this.suggestedPlaces = res)));
  }

  /**
   *
   */
  onSearch(query?: string): void {
    if ((!query && !this.query) || this.query == null) {
      return;
    }
    this.search.emit({
      query: query || this.query,
      minDifficulty: this.minDifficultyCoeff,
      maxDifficulty: this.maxDifficultyCoeff,
      minPosition: this.minDistanceCoeff,
      maxPosition: this.maxDistanceCoeff,
      minWeather: this.minWeatherCoeff,
      maxWeather: this.maxWeatherCoeff,
    });
  }

  /**
   *
   */
  onSuggestionSelected(item: PlaceSuggestion): void {
    this.geoService
      .geocodeByPlaceId(item.place_id)
      .then((results: any) => {
        // Use the first result in the list to get the geometry coordinates
        const { geometry, address_components } = results[0];
        const city = address_components[0].long_name;

        item.geo = new GeoLocation(geometry.location.lat(), geometry.location.lng(), undefined, city);

        this.suggestionSelected.emit(item);
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   *
   */
  onPreferencesUpdated(): void {
    this.optionsUpdated.emit({
      query: this.query,
      minDifficulty: this.minDifficultyCoeff,
      maxDifficulty: this.maxDifficultyCoeff,
      minPosition: this.minDistanceCoeff,
      maxPosition: this.maxDistanceCoeff,
      minWeather: this.minWeatherCoeff,
      maxWeather: this.maxWeatherCoeff,
    });
  }
}
