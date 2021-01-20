import Link from "next/link";

function PostPreview({
  articleType,
  heading,
  introduction,
  sharingImage,
  slug,
}) {
  const articleTitle = "What to Watch " + heading;
  const articleLink = "/blog/" + slug;
  return (
    <Link href={articleLink}>
      <div>
        <img src={sharingImage} alt={articleTitle} />
        <p>{introduction.slice(1, 150)}</p>
      </div>
    </Link>
  );
}

export default PostPreview;
