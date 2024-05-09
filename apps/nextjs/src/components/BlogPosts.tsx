import Image from "next/image";
import blogs from "public/blogs";
import Link from "next/link";

interface Post {
  picture: string;
  title: string;
  date: string;
  post: string;
  key: number;
}

const BlogPost: React.FC<Post> = ({ picture, title, date, post, key }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center py-12">
      <Image
        fill={false}
        width={300}
        height={300}
        className="aspect-[4/5] h-80 w-96 rounded-md object-cover border bg-gray-50 shadow-lg"
        src={picture}
        alt=""
      />
      <div className="flex w-[600px] max-w-full flex-col flex-wrap justify-center space-y-2 pl-8">
        <h1>{key}</h1>
        <h1 className="font-general-sans-regular text-md italic">{date}</h1>
        <h2 className="font-satoshi-regular text-2xl font-semibold">{title}</h2>
        <p className="font-general-sans-regular line-clamp-3 text-lg">{post}</p>
        <Link
          href={`/blog/0`} //TODO when adding another blog change this 
          className="font-general-sans-regular flex justify-end pr-5 text-md text-primary-800 underline"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export function BlogPosts() {
  const posts = blogs;
  return (
    <div className="pt-12">
      {posts.map((post, index) => (
        <BlogPost
          key={index}
          picture={post.picture}
          title={post.title}
          date={post.date}
          post={post.post}
        />
      ))}
    </div>
  );
}
