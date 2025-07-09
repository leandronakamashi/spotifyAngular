import { Component, inject, OnInit } from '@angular/core';
import { SpotifyService } from '../../service/spotify-service';
import { InfoUsu } from '../info-usu/info-usu';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [InfoUsu, SafeUrlPipe],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  private spotifyService = inject(SpotifyService);
  usuario: any = null;
  top5: any = null;
  playList: any = null;
  iframeSrc: string = '';
  async ngOnInit() {
    this.verificarTokenUrlCallback();
  }

  tocar(id: string, tipo: string) {
    this.iframeSrc = `https://open.spotify.com/embed/${tipo}/${id}`;
  }

  async verificarTokenUrlCallback() {
    const token = this.spotifyService.obterUrlCallback();

    if (token) {
      await this.spotifyService.definirAccesToken(token);
      this.usuario = await this.spotifyService.pegaUsu();
      this.top5 = await this.spotifyService.pegaTop5();
      this.playList = await this.spotifyService.pegarPlaylists();
      // this.spotifyService.pegaUsu();
      console.log(await this.spotifyService.pegaUsu());
      console.log(await this.spotifyService.pegaTop5());
      console.log(await this.spotifyService.pegarPlaylists());
    }
  }
}
