// @flow

export type Show = {
  title: string,
  description: string,
  year: string,
  imdbID: string,
  trailer: string,
  poster: string
};

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
};
