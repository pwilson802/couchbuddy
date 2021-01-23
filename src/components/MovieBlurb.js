import { getCouchmovie } from "../graphql/queries";
import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";

async function getMovieDetails(id) {
  const movieDetails = await API.graphql({
    query: getCouchmovie,
    variables: { movieID: id },
  });
  console.log(movieDetails.data.getCouchmovie);
  return movieDetails.data.getCouchmovie;
}

function MovieBlurb({ id, body }) {
  const [title, setTitle] = useState();
  const [tagline, setTagline] = useState();
  const [runtime, setRuntime] = useState();
  const [image, setImage] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function setMovieCard() {
      const {
        title,
        overview,
        tagline,
        runtime,
        image,
        vote_average,
      } = await getMovieDetails(id);
      setTitle(title);
      setTagline(tagline);
      setRuntime(runtime);
      const imagePath = "http://image.tmdb.org/t/p/w185" + image;
      setImage(imagePath);
      // const providerLogos = providers.map(
      //   (item) => allProviderData[item]["logo"]
      // );
      // console.log("providerLogos", providerLogos);
      // setProviderImages(providerLogos);
      setLoaded(true);
    }
    setMovieCard();
  }, [id]);

  return (
    <div>
      {loaded && (
        <div>
          <h1>{title}</h1>
          <img src={image} alt="" />
          <p>{body}</p>
        </div>
      )}
    </div>
  );
}

export default MovieBlurb;
