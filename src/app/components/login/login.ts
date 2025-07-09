import { Component } from '@angular/core';
import { SpotifyService } from '../../service/spotify-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private spotifyService: SpotifyService) {}

  async abrirPaginaLogin() {
    const url = await this.spotifyService.obterUrlLogin();
    // window.location.href = url;
  }
}
