export interface UserInfo {
  id: number;
  username: string;
  role: string;
}

export interface Prods {
  id: number;
  name: string;
  tag: string;
  coverProdFile: string;
  prodFile: string;
  instrurapLink: string;
  BPM: number;
  key: string;
  price: number;
  prod_name: string;
  cover: string;
  releaseDate: string;
  idTB: number;
  typebeat: string;
}

export interface Playlist {
  id: number;
  name: string;
  tag: string;
  coverProdFile: string;
  instrurapLink: string;
  BPM: number;
  key: string;
  price: number;
  prod_id: number;
  prod_name: string;
  cover: string;
  releaseDate: string;
  idTB: number;
}

export interface SongReco {
  id: number;
  song: string;
  genre: string;
  beatmaker: string;
  ytLink: string;
  spotifyLink: string;
}

export interface ArtistReco {
  id: number;
  name: string;
  img: string;
}