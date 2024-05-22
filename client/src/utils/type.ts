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

export interface BlogImage {
  id: number;
  idBlog: number;
  name: string;
}

export interface Liked {
  idBlog: number;
  idUser: number;
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
  avatar: string;
  category: string;
  image: BlogImage[];
}

export interface Category {
  id: number;
  name: string;
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
