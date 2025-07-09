import { Injectable } from "@angular/core";
import { SpotifyConfiguration } from "../../environments/environment";
import Spotify from "spotify-web-api-js";
import { UsuarioSpotify } from "../iterface/usuarioSpotify";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  spotifyApi: Spotify.SpotifyWebApiJs = new Spotify();

  constructor() {}

  gerarCodeVerifier(length = 128) {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => possible[x % possible.length])
      .join("");
  }

  async gerarCodeChallenge(verifier: string) {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verifier)
    );
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async obterUrlLogin() {
    // const authEndponit = `${SpotifyConfiguration.authEndpoint}?`;
    // const clientId = `client_id=${SpotifyConfiguration.clientId}&`;
    // const redirectUri = `redirect_uri=${SpotifyConfiguration.redirectUrl}&`;
    // const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`;
    // const responseType = `response_type=code&show_dialog=true`;
    // return `${authEndponit}${clientId}${redirectUri}${scopes}${responseType}`;
    const clientId = "b1baa09d749e48e0adaac0424dbd9400";
    const redirectUri = SpotifyConfiguration.redirectUrl;
    const codeVerifier = this.gerarCodeVerifier();
    const codeChallenge = await this.gerarCodeChallenge(codeVerifier);
    console.log("codeVerifier:", codeVerifier);
    localStorage.setItem("code_verifier", codeVerifier);
    console.log("codeVerifier:", codeVerifier);
    console.log("localStorage:", localStorage.getItem("code_verifier"));
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: SpotifyConfiguration.scopes.join(" "),
      redirect_uri: redirectUri,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  obterUrlCallback() {
    const parans = new URLSearchParams(window.location.search);
    const code = parans.get("code");

    return code;
  }

  async definirAccesToken(token: string) {
    console.log("entrou no definir acces token=", token);
    const code = new URLSearchParams(window.location.search).get("code");
    const codeVerifier = localStorage.getItem("code_verifier");
    if (!codeVerifier) {
      console.error(
        "❌ code_verifier não encontrado no localStorage!" + codeVerifier
      );
      return;
    }
    const body = new URLSearchParams({
      client_id: "b1baa09d749e48e0adaac0424dbd9400",
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: SpotifyConfiguration.redirectUrl,
      // redirect_uri: 'http://127.0.0.1:4200/main',
      code_verifier: codeVerifier!,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await response.json();
    // console.log('RESPONSE:', response.status, data);
    // console.log('ACCESS TOKEN:', data.access_token);

    this.spotifyApi.setAccessToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    this.spotifyApi.skipToNext();
  }

  async pegaUsu(): Promise<UsuarioSpotify> {
    const user = await this.spotifyApi.getMe();

    return {
      nome: user.display_name ?? "",
      email: user.email,
      foto: user.images && user.images.length > 0 ? user.images[0].url : "",
    };
  }

  async pegaTop5(): Promise<any> {
    const topTracks = await this.spotifyApi.getMyTopTracks({ limit: 5 });
    return topTracks.items;
  }

  async pegarPlaylists(): Promise<any[]> {
    const playlists = await this.spotifyApi.getUserPlaylists();
    return playlists.items;
  }

  async buscarMusicas(query: string): Promise<any[]> {
    if (!query) return [];
    const result = await this.spotifyApi.searchTracks(query, { limit: 10 });
    return result && result.tracks && result.tracks.items
      ? result.tracks.items
      : [];
  }
}
