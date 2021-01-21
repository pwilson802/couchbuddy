/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCouchmovie = /* GraphQL */ `
  mutation CreateCouchmovie(
    $input: CreateCouchmovieInput!
    $condition: ModelcouchmovieConditionInput
  ) {
    createCouchmovie(input: $input, condition: $condition) {
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
export const updateCouchmovie = /* GraphQL */ `
  mutation UpdateCouchmovie(
    $input: UpdateCouchmovieInput!
    $condition: ModelcouchmovieConditionInput
  ) {
    updateCouchmovie(input: $input, condition: $condition) {
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
export const deleteCouchmovie = /* GraphQL */ `
  mutation DeleteCouchmovie(
    $input: DeleteCouchmovieInput!
    $condition: ModelcouchmovieConditionInput
  ) {
    deleteCouchmovie(input: $input, condition: $condition) {
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
export const createGenre = /* GraphQL */ `
  mutation CreateGenre(
    $input: CreateGenreInput!
    $condition: ModelgenreConditionInput
  ) {
    createGenre(input: $input, condition: $condition) {
      genre
      movieIDs
      createdAt
      updatedAt
    }
  }
`;
export const updateGenre = /* GraphQL */ `
  mutation UpdateGenre(
    $input: UpdateGenreInput!
    $condition: ModelgenreConditionInput
  ) {
    updateGenre(input: $input, condition: $condition) {
      genre
      movieIDs
      createdAt
      updatedAt
    }
  }
`;
export const deleteGenre = /* GraphQL */ `
  mutation DeleteGenre(
    $input: DeleteGenreInput!
    $condition: ModelgenreConditionInput
  ) {
    deleteGenre(input: $input, condition: $condition) {
      genre
      movieIDs
      createdAt
      updatedAt
    }
  }
`;
export const createWatchOn = /* GraphQL */ `
  mutation CreateWatchOn(
    $input: CreateWatchOnInput!
    $condition: ModelwatchOnConditionInput
  ) {
    createWatchOn(input: $input, condition: $condition) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const updateWatchOn = /* GraphQL */ `
  mutation UpdateWatchOn(
    $input: UpdateWatchOnInput!
    $condition: ModelwatchOnConditionInput
  ) {
    updateWatchOn(input: $input, condition: $condition) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const deleteWatchOn = /* GraphQL */ `
  mutation DeleteWatchOn(
    $input: DeleteWatchOnInput!
    $condition: ModelwatchOnConditionInput
  ) {
    deleteWatchOn(input: $input, condition: $condition) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const createMovieLength = /* GraphQL */ `
  mutation CreateMovieLength(
    $input: CreateMovieLengthInput!
    $condition: ModelmovieLengthConditionInput
  ) {
    createMovieLength(input: $input, condition: $condition) {
      movieID
      runtime
      createdAt
      updatedAt
    }
  }
`;
export const updateMovieLength = /* GraphQL */ `
  mutation UpdateMovieLength(
    $input: UpdateMovieLengthInput!
    $condition: ModelmovieLengthConditionInput
  ) {
    updateMovieLength(input: $input, condition: $condition) {
      movieID
      runtime
      createdAt
      updatedAt
    }
  }
`;
export const deleteMovieLength = /* GraphQL */ `
  mutation DeleteMovieLength(
    $input: DeleteMovieLengthInput!
    $condition: ModelmovieLengthConditionInput
  ) {
    deleteMovieLength(input: $input, condition: $condition) {
      movieID
      runtime
      createdAt
      updatedAt
    }
  }
`;
export const createMovieData = /* GraphQL */ `
  mutation CreateMovieData(
    $input: CreateMovieDataInput!
    $condition: ModelmovieDataConditionInput
  ) {
    createMovieData(input: $input, condition: $condition) {
      movieID
      runtime
      vote_average
      vote_count
      createdAt
      updatedAt
    }
  }
`;
export const updateMovieData = /* GraphQL */ `
  mutation UpdateMovieData(
    $input: UpdateMovieDataInput!
    $condition: ModelmovieDataConditionInput
  ) {
    updateMovieData(input: $input, condition: $condition) {
      movieID
      runtime
      vote_average
      vote_count
      createdAt
      updatedAt
    }
  }
`;
export const deleteMovieData = /* GraphQL */ `
  mutation DeleteMovieData(
    $input: DeleteMovieDataInput!
    $condition: ModelmovieDataConditionInput
  ) {
    deleteMovieData(input: $input, condition: $condition) {
      movieID
      runtime
      vote_average
      vote_count
      createdAt
      updatedAt
    }
  }
`;
export const createProvider = /* GraphQL */ `
  mutation CreateProvider(
    $input: CreateProviderInput!
    $condition: ModelproviderConditionInput
  ) {
    createProvider(input: $input, condition: $condition) {
      providerID
      providerName
      providerLogo
      createdAt
      updatedAt
    }
  }
`;
export const updateProvider = /* GraphQL */ `
  mutation UpdateProvider(
    $input: UpdateProviderInput!
    $condition: ModelproviderConditionInput
  ) {
    updateProvider(input: $input, condition: $condition) {
      providerID
      providerName
      providerLogo
      createdAt
      updatedAt
    }
  }
`;
export const deleteProvider = /* GraphQL */ `
  mutation DeleteProvider(
    $input: DeleteProviderInput!
    $condition: ModelproviderConditionInput
  ) {
    deleteProvider(input: $input, condition: $condition) {
      providerID
      providerName
      providerLogo
      createdAt
      updatedAt
    }
  }
`;
export const createCertification = /* GraphQL */ `
  mutation CreateCertification(
    $input: CreateCertificationInput!
    $condition: ModelcertificationConditionInput
  ) {
    createCertification(input: $input, condition: $condition) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const updateCertification = /* GraphQL */ `
  mutation UpdateCertification(
    $input: UpdateCertificationInput!
    $condition: ModelcertificationConditionInput
  ) {
    updateCertification(input: $input, condition: $condition) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
export const deleteCertification = /* GraphQL */ `
  mutation DeleteCertification(
    $input: DeleteCertificationInput!
    $condition: ModelcertificationConditionInput
  ) {
    deleteCertification(input: $input, condition: $condition) {
      country
      data
      createdAt
      updatedAt
    }
  }
`;
