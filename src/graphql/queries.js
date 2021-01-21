/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCouchmovie = /* GraphQL */ `
  query GetCouchmovie($movieID: String!) {
    getCouchmovie(movieID: $movieID) {
      movieID
      title
      overview
      image
      release_date
      tagline
      runtime
      vote_average
      vote_count
      createdAt
      updatedAt
    }
  }
`;
export const listCouchmovies = /* GraphQL */ `
  query ListCouchmovies(
    $movieID: String
    $filter: ModelcouchmovieFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCouchmovies(
      movieID: $movieID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        movieID
        title
        overview
        image
        release_date
        tagline
        runtime
        vote_average
        vote_count
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGenre = /* GraphQL */ `
  query GetGenre($genre: String!) {
    getGenre(genre: $genre) {
      genre
      movieIDs
      createdAt
      updatedAt
    }
  }
`;
export const listGenres = /* GraphQL */ `
  query ListGenres(
    $genre: String
    $filter: ModelgenreFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGenres(
      genre: $genre
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        genre
        movieIDs
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getWatchOn = /* GraphQL */ `
  query GetWatchOn($country: String!) {
    getWatchOn(country: $country) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const listWatchOns = /* GraphQL */ `
  query ListWatchOns(
    $country: String
    $filter: ModelwatchOnFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listWatchOns(
      country: $country
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        country
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMovieLength = /* GraphQL */ `
  query GetMovieLength($movieID: String!) {
    getMovieLength(movieID: $movieID) {
      movieID
      runtime
      createdAt
      updatedAt
    }
  }
`;
export const listMovieLengths = /* GraphQL */ `
  query ListMovieLengths(
    $movieID: String
    $filter: ModelmovieLengthFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMovieLengths(
      movieID: $movieID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        movieID
        runtime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMovieData = /* GraphQL */ `
  query GetMovieData($movieID: String!) {
    getMovieData(movieID: $movieID) {
      movieID
      runtime
      vote_average
      vote_count
      createdAt
      updatedAt
    }
  }
`;
export const listMovieDatas = /* GraphQL */ `
  query ListMovieDatas(
    $movieID: String
    $filter: ModelmovieDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMovieDatas(
      movieID: $movieID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        movieID
        runtime
        vote_average
        vote_count
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProvider = /* GraphQL */ `
  query GetProvider($providerID: String!) {
    getProvider(providerID: $providerID) {
      providerID
      providerName
      providerLogo
      createdAt
      updatedAt
    }
  }
`;
export const listProviders = /* GraphQL */ `
  query ListProviders(
    $providerID: String
    $filter: ModelproviderFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProviders(
      providerID: $providerID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        providerID
        providerName
        providerLogo
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCertification = /* GraphQL */ `
  query GetCertification($country: String!) {
    getCertification(country: $country) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const listCertifications = /* GraphQL */ `
  query ListCertifications(
    $country: String
    $filter: ModelcertificationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCertifications(
      country: $country
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        country
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
