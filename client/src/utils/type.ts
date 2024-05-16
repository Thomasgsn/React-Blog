export interface UserInfo {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  avatar: string;
  detail: string;
  email: string;
  role: string;
}

export interface BlogInfo {
  id: number;
  title: string;
  text: string;
  idUser: number;
  tag: string;
  releaseDate: string;
  idCategory: number;
  username: string;
  avatar: number;
  category: string;
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

export interface UserVisit {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  avatar: string;
  detail: string;
  email: string;
  role: string;
}
