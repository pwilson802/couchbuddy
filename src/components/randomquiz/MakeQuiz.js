export { MakeQuiz, MakeMoviesList, MakeQuestionsList, MakeQuestion }

async function MakeMoviesList() {
    let moviesList = [];
  const randomNumbers = getRandomNumbers(5);
  for (let num of randomNumbers) {
    let movies = await getRandomMovies(num);
    moviesList = [...moviesList, ...movies.results];
  }
  shuffle(moviesList);
  const selectedMoviesList = moviesList.splice(0, 15)
  const extraMovies = moviesList.splice(16, 99)
  return [selectedMoviesList, extraMovies]

}

function MakeQuestionsList() {
  let questions = [
    makeTaglineQuestion,
    makeTaglineQuestion,
    makeCharacterinMovieQuestion,
    makeCharacterinMovieQuestion,
    makeWhoPlayedCharacterQuestion,
    makeWhoPlayedCharacterQuestion,
    makeWhoDidActorPlayQuestion,
    makeWhoDidActorPlayQuestion,
    makeWhoDidntDirectQuestion,
    makeWhoDidntDirectQuestion,
    makeMovieFromPictureQuestion,
    makeMovieFromPictureQuestion,
    makeMovieFromPictureQuestion,
    makeMoviesStaringPersonQuestion,
    makeMoviesStaringPersonQuestion,
  ]
  shuffle(questions)
  return questions
}

async function MakeQuestion(question, movie, extraMovies, index, internalData) {
  const movieList = [movie, ...extraMovies.slice(index,)]
  for (let m of movieList) {
    let newQuestion = await question(m, extraMovies.slice(20,), internalData)
    let validate = validateQuestion(newQuestion[0])
    if (validate) {
      return newQuestion
    }
    // console.log("quesiton not valid", newQuestion)
  }
}

function validateQuestion(question) {
  // console.log(question)
  // Question is a string and long enough
  if (question.question.length < 5) {
    // console.log("questin is not long enough")
    return false
  }
  if (question.answers.length !== 4) {
    // console.log("not the correct amount on answers")
    return false
  }
  if (question.imageUrl) {
    if (question.imageUrl.length < 10) {
      // console.log("imageUrl is not correct for image question")
      return false
    } 
  }
  return true
}

async function MakeQuiz() {
  let movies, extraMovies
  [movies, extraMovies] = await MakeMoviesList()
  const questionsList = MakeQuestionsList()
  // console.log(questionsList)
  const questions = []

  for (let i = 0; i < 15; i++){
    let newQuestion = await questionsList[i](movies[i], extraMovies)
    questions.push(newQuestion)
  }
    return questions
}


async function getRandomMovies(page) {
  const url = `/api/randomquiz/getrandommovies/${page}`;
  const response = await fetchRetry(url, 3);
  const result = await response.json();
  return result;
}

async function getMovieDetails(id) {
  const url = `/api/randomquiz/getmoviedetails/${id}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  return json
}

async function getPopularMovies() {
  const page = Math.floor(Math.random() * 20) + 1;
  const url = `/api/randomquiz/getpopularmovies/${page}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  return json.results
}

async function getMoviesByDirector(director) {
  const url = `/api/randomquiz/getmoviesbydirector/${director.id}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  return json.results
}

async function getMoviesByActor(actor) {
  const url = `/api/randomquiz/getmoviesbyactor/${actor.id}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  return json.results
}

async function getMovieTagline(id) {
  const json = await getMovieDetails(id)
  const tagline = json['tagline']
  // console.log(tagline)
  return tagline
}

async function getMovieCast(id) {
  const url = `/api/randomquiz/getmoviecredits/${id}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  return json["cast"]
}

async function getMovieCrew(id) {
  const url = `/api/randomquiz/getmoviecredits/${id}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  return json["crew"]
}

async function getStarfromMovie(movie) {
  const cast = await getMovieCast([movie.id])
  return cast[0]
}

async function getMainCharacter(id) {
  try {
    const url = `/api/randomquiz/getmoviecredits/${id}`;
    const response = await fetchRetry(url, 3);
    const json = await response.json();
    const character = json["cast"][0]["character"]
    return character
  } catch {
    return ""
  }
}

async function getMovieImage(movie) {
  const url = `/api/randomquiz/getmovieimages/${movie.id}`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  // console.log("movie image")
  // console.log(json)
  const images = json["backdrops"]
  const imagesNoCountry = images.filter((item) => item.iso_639_1 == null )
  // console.log(images)
  const popularImages = imagesNoCountry.slice(0, 10)
  shuffle(popularImages)
  return `https://image.tmdb.org/t/p/w300${popularImages[0]["file_path"]}`
}

async function getAlternativeActors(castDetails, movie, num) {
  // console.log(castDetails)
  const year = movie["release_date"].split("-")[0]
  const startYear = Number(year) - 5
  const endYear = Number(year) + 5
  // console.log("*********************************************************")
  // console.log("start year", startYear)
  // console.log("end Year", endYear)
  const page = makePageFromYear(year)
  const url = `/api/randomquiz/getpopularmoviebyrange/${startYear}/${endYear}/${page}`
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  const movies = json['results']
  let count = 0
  const result = []
  for (let m of movies) {
    let movieCast = await getMovieCast(m["id"])
    if (movieCast.length < 3) {
      continue
    }
    let castOptions = movieCast.slice(0, 3)
    // console.log(castOptions)
    for (let cast of castOptions) {
      if (cast.name === castDetails.name || result.includes(cast.name)) {
        continue
      }
      if (cast.gender === castDetails.gender) {
        result.push(cast.name)
        count++
        break
      }
    }
    if (count > num + 1) {
          break
    }
  }
  return result.slice(0,num)
}

async function getSimilarMovieByDirector(director, movie) {
  const url = `/api/randomquiz/getsimilarmovies/${movie.id}/1`;
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  const allMovies = json['results']
  const year = movie["release_date"].split("-")[0]
  let closeMovies = allMovies.filter((item) => {
    let movieYear = item["release_date"].split("-")[0]
    if (year - movieYear < 10 && year - movieYear > -10) {
      return true
    }
  })
  let closeIds = closeMovies.map((item) => item.id)
  shuffle(closeMovies)
  for (let movie of allMovies) {
    if (!closeIds.includes(movie.id)){
      closeMovies.push(movie)
    }
  }
  for (movie of closeMovies) {
    let crew = await getMovieCrew(movie.id)
    let movieDirector = crew.filter(item => item.job === "Director")[0]
    if (movieDirector.id !== director.id) {
      return movie
    }
  }

}

async function getSimilarMovies(id, year) {
  let allMovies = []
  const pages = [1, 2, 3, 4, 5]
  for (let page of pages) {
    let url = `/api/randomquiz/getsimilarmovies/${id}/${page}`;
    let response = await fetchRetry(url, 3);
    let json = await response.json();
    let moviesAll = json['results']
    shuffle(moviesAll)
    allMovies = [...allMovies, ...moviesAll]
  }

  let closeMovies = allMovies.filter((item) => {
    let movieYear = item["release_date"].split("-")[0]
    if (year - movieYear < 5 && year - movieYear > -5) {
      return true
    }
  })
  // console.log("+++++++++++++++++++++++++++++++++++++")
  // console.log(closeMovies)
  // console.log("+++++++++++++++++++++++++++++++++++++")
  let closeIds = closeMovies.map((item) => item.id)
  // console.log(closeIds)
  shuffle(closeMovies)
  for (let movie of allMovies) {
    if (!closeIds.includes(movie.id)){
      closeMovies.push(movie)
    }
  }
  let ids = []
  let result = []
  for (let movie of closeMovies) {
    if (ids.includes(movie.id)){
      continue
    }
    result.push(movie)
    ids.push(movie.id)
  }
  // console.log("-----------RESULT OF SIMILAR MOVIES------------------")
  // console.log(result)
  return result

}

async function getAlternativeMovies(originalMovie, num, character = "", actor = "") {
  const id = originalMovie.id
  const year = originalMovie["release_date"].split("-")[0]
  const moviesAll = await getSimilarMovies(id, year)
  const movies = moviesAll.filter((item) => item.title !== originalMovie.title )
  let titles = []
  if (character !== "") {
      let count = 0
      for (let movie of movies) {
        let movieCharacter = await getMainCharacter(movie['id'])
        if (movieCharacter !== character) {
          titles.push(movie['title'])
        }
        count++
        if (count > num + 1) {
          break
        }
      }
    return titles.slice(0,num)
  }
  if (actor !== "") {
    let count = 0
    for (let movie of movies) {
      let cast = await getMovieCast(movie['id'])
      let castIds = cast.map(item => item.id) 
      let actorNames = cast.map(item => item.name)
      if (!castIds.includes(actor.id) && !actorNames.includes(actor.name)) {
          titles.push(movie['title'])
          count++
      } else {
        continue
        }
      if (count > num + 1) {
          break
        }
    }
    return titles.slice(0,num)
  }
  titles = movies.map((item) => item.title)
  return titles.slice(0,num)
}

async function getChastMember(id) {
  try {
    const url = `/api/randomquiz/getmoviecredits/${id}`;
    const response = await fetchRetry(url, 3);
    const json = await response.json();
    return json["cast"][0]
  } catch {
    return ""
  }
}

async function makeTaglineQuestion(movie, extraMovies, internalData) {
  let id = movie.id
  let usedMovies = internalData["tagline"]
  // const startTime = new Date().getTime();  
  let tagline = await getMovieTagline(movie['id'])
  tagline = usedMovies.includes(movie.id) ? "" : tagline
  if (tagline === "") {
    // console.log("--------TAGLINE IS EMPTY--------")
    for (let m of extraMovies) {
      movie = m
      if (usedMovies.includes(movie.id)) {
        continue
      }
      tagline = await getMovieTagline(movie['id'])
      if (tagline !== "") {
        id = movie.id
        break
      } 
    }
  }
  const alternatives = await getAlternativeMovies(movie, 3)
  // console.log(alternatives)
  const question = `tagline!!!Name the movie from the tagline:\n${tagline}`
  const answers = [movie.original_title]
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  //do something 
  // const endTime = new Date().getTime();
  // console.log(`makeTaglineQuestion: ${(endTime - startTime) / 1000} seconds`);
  internalData["tagline"].push(movie.id)
  return [questionObject, internalData]
}

async function makeCharacterinMovieQuestion(movie, extraMovies, internalData) {
  let id = movie.id
  let usedMovies = internalData["characterInMovie"]
  // const startTime =new Date().getTime();
  let character = await getMainCharacter(movie['id'])
  character = usedMovies.includes(movie.id) ? "" : character
  if (character === "") {
    // console.log("---------NO CHARACTER IN MOVIE-----------")
    // console.log("movie:", movie.original_title)
    for (let m of extraMovies) {
      movie = m
      if (usedMovies.includes(movie.id)) {
        continue
      }
      character = await getMovieTagline(movie['id'])
      if (character !== "") {
        break
      } 
    }
  }
  // console.log(character)
  const alternatives = await getAlternativeMovies(movie, 3, character)
  // console.log(alternatives)
  const year = movie["release_date"].split("-")[0]
  let question = `characterInMovie!!!The character ${character} is in which ${year} movie?`
  if (question.includes("(voice)")) {
    question = question.replace("(voice) ","")
  }
  const answers = [movie.original_title]
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  // const endTime = new Date().getTime();
  // console.log(`makeCharacterinMovieQuestion: ${(endTime - startTime) / 1000} seconds`);
  internalData["characterInMovie"].push(movie.id)
  return [questionObject, internalData]
  // return questionObject
}

async function makeWhoPlayedCharacterQuestion(movie, extraMovies, internalData) {
  let id = movie.id
  let usedMovies = internalData["whoPlayedCharacter"]
  // const startTime =new Date().getTime();
  let castDetails = await getChastMember(movie['id'])
  castDetails = usedMovies.includes(movie.id) ? "" : castDetails
  if (castDetails === "") {
    // console.log("---------NO CHARACTER IN MOVIE-----------")
    // console.log("movie:", movie.original_title)
    for (let m of extraMovies) {
      movie = m
      if (usedMovies.includes(movie.id)) {
        continue
      }
      castDetails = await getChastMember(movie['id'])
      if (castDetails !== "") {
        break
      } 
    }
  }
  const alternatives = await getAlternativeActors(castDetails, movie, 3)
  const year = movie["release_date"].split("-")[0]
  let question = `whoPlayedCharacter!!!Who played ${castDetails.character} in the ${year} movie ${movie.title}?`
  if (question.includes("(voice)")) {
    question = question.replace("Who played", "Who voiced")
    question = question.replace("(voice) ","")
  }
  const answers = [castDetails.name]
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  const endTime = new Date().getTime();
  // console.log(`makeWhoPlayedCharacterQuestion: ${(endTime - startTime) / 1000} seconds`);
  internalData["whoPlayedCharacter"].push(movie.id)
  return [questionObject, internalData]
  //return questionObject

}

function alternateCastMembers(cast) {
  const answer = cast[0]
  const otherMembers = cast.slice(1,)
  const viableOptions = otherMembers.filter((item) => {
    if (item.gender === answer.gender && item.popularity > 10) {
      return true
    }
    return []
  })
  if (viableOptions.length > 3) {
    return viableOptions.slice(0,3)
  }
  return []
}

async function getMovieFromYear(year) {
  // console.log("getting movie from year")
  let voteAverage = 7
  let voteCount = 700
  if (year < 1960) {
    voteAverage = 6
    voteCount = 100
  }
  if (year < 1950) {
    voteAverage = 2
    voteCount = 0
  }
  const url = `/api/randomquiz/getmoviefromyear/${voteCount}/${voteAverage}/${year}`
  const response = await fetchRetry(url, 3);
  const json = await response.json();
  const movies = json["results"]
  // console.log("movies from year", movies)
  shuffle(movies)
  return movies[0].title
}

async function getCloseYearMovies(year) {
  // console.log('running getCloseYearsMovies')
  let years = []
  let result = []
  if (year > 2020) {
    years = [Number(year) - 2, Number(year) - 3, Number(year) - 3]
  } else {
    years = [Number(year) + 2, Number(year) - 3, Number(year) - 2]
  }
  // console.log("years", years)
  for (let y of years) {
    let movie = await getMovieFromYear(y)
    result.push(movie)
  }
  return result
}


async function makeWhoDidActorPlayQuestion(movie, extraMovies, internalData) {
  // console.log("making who did actor play quesiton.")
  let id = movie.id
  let usedMovies = internalData["whoDidActorPlay"]
  // const startTime =new Date().getTime();
  // console.log(extraMovies)
  let cast = await getMovieCast(movie['id'])
  let otherCast = alternateCastMembers(cast)
  otherCast = usedMovies.includes(movie.id) ? [] : otherCast
  console.log(otherCast)
  // console.log(usedMovies)
  // console.log(movie.id)
  if (otherCast.length == 0) {
    // console.log("cast not valid")
    for (let m of extraMovies) {
      console.log("cast not valid")
      // console.log(m.id)
      movie = m
      if (usedMovies.includes(movie.id)) {
        continue
      }
      cast = await getMovieCast(movie['id'])
      otherCast = alternateCastMembers(cast)
      console.log(otherCast)
      if (otherCast.length == 0) {
        console.log("otherCast not valid again")
        break
      }
    }
  }
  const year = movie["release_date"].split("-")[0]
  const question = `whoDidActorPlay!!!Who did ${cast[0].name} play in the ${year} movie ${movie.title}?`
  const answers = [cast[0].character]
  const alternatives = otherCast.map(item => item.character)
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  // const endTime = new Date().getTime();
  // console.log(`makeWhoDidActorPlayQuestion: ${(endTime - startTime) / 1000} seconds`);
  internalData["whoDidActorPlay"].push(movie.id)
  return [questionObject, internalData]
}

async function makePickMovieinYearQuestion(movie) {
  // const startTime =new Date().getTime();
  const year = movie["release_date"].split("-")[0]
  const alternatives = await getCloseYearMovies(year)
  const question = `which movie was released in ${year}`
  const answers = [movie["title"]]
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  const endTime = new Date().getTime();
  // console.log(`makePickMovieinYearQuestion: ${(endTime - startTime) / 1000} seconds`);
  return questionObject
}

async function validateDirector(director, compareMovie) {
  const allMovies = await getMoviesByDirector(director)
  const movies = allMovies.filter(item => item.id !== compareMovie.id).filter(item => item.title !== compareMovie.title)
  let result = []
  let count = 0
  for (let movie of movies) {
    let crew = await getMovieCrew(movie.id)
    let movieDirector = crew.filter(item => item.job === "Director")[0]
    if (movieDirector.id === director.id) {
      result.push(movie)
      count++
    }
    if (count >= 2) {
      return result
    }
  }
  return false

}


async function getValidDirectorAndMovies(movie, usedDirectors) {
  const crew = await getMovieCrew(movie.id)
  const director = crew.filter(item => item.job === "Director")[0]
  // console.log(movie.title, director)
  if (usedDirectors.includes(director.id)) {
    return false
  }
  const movies = await validateDirector(director, movie)
  if (movies === false) {
    return false
  }
  const allMovies = [...movies, movie]
  return [director, allMovies]
}

async function makeWhoDidntDirectQuestion(movie, extraMovies, internalData) {
  let usedDirectors = internalData["WhoDidntDirect"]
  // const startTime =new Date().getTime();
  const movies = await getPopularMovies()
  // console.log('popular movies', movies)
  shuffle(movies)
  let directorMovies
  for (let movie of movies) {
    directorMovies = await getValidDirectorAndMovies(movie, usedDirectors)
    if (directorMovies !== false) {
      break
    }
  }
  const director = directorMovies[0]
  const directedMovies = directorMovies[1]
  // console.log(directorMovies)
  const answerObj = await getSimilarMovieByDirector(director, directedMovies[0])
  const answers = [answerObj.title]
  const alternatives = directedMovies.map(item => item.title)
  const directorName = director.name
  const question = `WhoDidntDirect!!!Which movie was NOT directed by ${directorName}?`
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  // const endTime = new Date().getTime();
  // console.log(`makeWhoDidntDirectQuestion: ${(endTime - startTime) / 1000} seconds`);
  internalData["WhoDidntDirect"].push(director.id)
  return [questionObject, internalData]
  return questionObject
}

async function makeMovieFromPictureQuestion(movie, extraMovies, internalData) {
  // const startTime =new Date().getTime();
  const imageUrl = await getMovieImage(movie)
  const alternatives = await getAlternativeMovies(movie, 3)
  const answers = [movie.title]
  const question = `movieFromPicture!!!Name the movie from the picture`
  const questionObject = makeQuestionObject(question, answers, alternatives, imageUrl)
  // const endTime = new Date().getTime();
  // console.log(`makeMovieFromPictureQuestion: ${(endTime - startTime) / 1000} seconds`);
  return [questionObject, internalData]
}

async function makeMoviesStaringPersonQuestion(movie, extraMovies, internalData) {
  // console.log("making who did star play")
  let usedPeople = internalData["movieStaringPerson"]
  const popularMovies = await getPopularMovies()
  shuffle(popularMovies)
  let star = ""
  let starsMovies = []
  for (let movie of popularMovies) {
    star = await getStarfromMovie(movie)
    if (usedPeople.includes(star.id)) {
      continue
    }
    if (star.popularity < 20) {
      continue
    }
    starsMovies = await getMoviesByActor(star)
    if (starsMovies.length > 1) {
      break
    }
  }
  starsMovies = starsMovies.slice(0,12)
  shuffle(starsMovies)
  const correctMovies = starsMovies.slice(0, 2)
  // console.log("star: ", star)
  // console.log("correct movies: ", correctMovies)
  const answers = correctMovies.map(item => item.title)
  const alternateMovies = await getAlternativeMovies(correctMovies[0], 5, "", star)
  const allAlternatives = alternateMovies.filter(item => {
    return !answers.includes(item.title)
  })
  // console.log(allAlternatives)
  const alternatives = allAlternatives.slice(0,2)
  const question = `movieStaringPerson!!!Which TWO movies feature ${star.name}?`
  const questionObject = makeQuestionObject(question, answers, alternatives, false)
  // const endTime = new Date().getTime();
  // console.log(`makeMoviesStaringPersonQuestion: ${(endTime - startTime) / 1000} seconds`);
  internalData["movieStaringPerson"].push(star.id)
  return [questionObject, internalData]
  // return questionObject
}

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (n === 1) throw err;
    return await fetchRetry(url, n - 1);
  }
};

function getRandomNumbers(num) {
  const result = [];
  let counter = 0;
  while (counter < num) {
    const randomNumber = Math.floor(Math.random() * 40) + 1;
    if (!result.includes(randomNumber)) {
      result.push(randomNumber);
      counter++;
    }
  }
  return result;
}

function makePageFromYear(year) {
  if (year < 1950) {
    return 1
  }
  const randomNumber = Math.floor(Math.random() * 3) + 1
  return randomNumber
}

function makeQuestionObject(question, answers, alternatives, imageUrl) {
  const result = {}
  result["numCorrect"] = answers.length
  result["imageUrl"] = imageUrl
  result["question"] = question
  const answersArray = []
  for (let a of answers) {
    let temp = {
      "answer": a,
      "correct": true
    }
    answersArray.push(temp)
  }
  for (let a of alternatives) {
    let temp = {
      "answer": a,
      "correct": false
    }
    answersArray.push(temp)
  }
     answersArray.sort(function () {
      return 0.5 - Math.random();
    });
  result["answers"] = answersArray
  return result

}

function shuffle(data) {
  // shuffle the questions using Fisher-Yates Algorithm
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = data[i];
    data[i] = data[j];
    data[j] = temp;
  }
  return data;
}





