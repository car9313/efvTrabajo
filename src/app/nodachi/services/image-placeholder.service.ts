import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagePlaceholderService {
  constructor() {
  }

  static placeHolders = {
    'vehicle': 'assets/vehicle_placeholder.png',
    'avatar': 'assets/user_placeholder.png',
    'building': 'assets/building_placeholder.png',
    'image': 'assets/image_placeholder.png'
  };

  public getPlaceHolder(photoType: string): string {
    return ImagePlaceholderService.placeHolders[photoType];
  }
}
