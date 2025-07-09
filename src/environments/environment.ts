export const environment = {
  production: false,
  // Adicione aqui suas variáveis de ambiente
};

export const SpotifyConfiguration = {
  clientId: "b1baa09d749e48e0adaac0424dbd9400",
  authEndpoint: "https://accounts.spotify.com/authorize",
  // redirectUrl: "http://127.0.0.1:4200/main",
  redirectUrl: "https://spotify-angular-omega.vercel.app/main",
  scopes: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
  ],
};
