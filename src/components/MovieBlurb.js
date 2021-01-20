function MovieBlurb({ movieID, body }) {
  return (
    <div>
      <h1>{movieID}</h1>
      <p>{body}</p>
    </div>
  );
}

export default MovieBlurb;
