import { Component, inject, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../../service/spotify-service';

@Component({
  selector: 'app-info-usu',
  imports: [],
  templateUrl: './info-usu.html',
  styleUrl: './info-usu.scss',
})
export class InfoUsu {
  private spotifyService = inject(SpotifyService);
  @Input() usuario: any;
  async ngOnInit() {}
}
