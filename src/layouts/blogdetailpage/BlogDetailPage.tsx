import styles from "./css/blog.module.css";
import clsx from "clsx";
import { BlogDetailBanner } from "./component/BlogDetailBanner";
import { BlogDetailComment } from "./component/BlogDetailComment";
import { BlogDetailLeft } from "./component/BlogDetailLeft";
import { BlogDetailRight } from "./component/BlogDetailRight";
import { useEffect, useState } from 'react';
import { BlogModel } from '../../models/BlogModel';
import { SpinnerLoading } from '../utils/SpinnerLoading';
import { Page404 } from '../errors/Page404';
import { UserForBlogModel } from "../../models/UserForBlogModel";

export const BlogDetailPage = () => {
  const [blog, setBlog] = useState<BlogModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // const blogId = (window.location.pathname).split("/")[2];
  const blogId = (window.location.pathname).split("-")[1];

  useEffect(() => {
    const fetchBlogDetail = async () => {
      const url = `http://localhost:8080/api/blogs/${blogId}`;


      const response = await fetch(url);


      if (!response.ok) {
        throw new Error("Something went wrong");
      }


      const responseJson = await response.json(); 

      const userInBlogResponse = await fetch(
        responseJson._links.user.href
      );
      if (!userInBlogResponse.ok) {
          throw new Error("Error fetching");
      }
      const userInBlogDataResponse = await userInBlogResponse.json();
      const userForBlog: UserForBlogModel = {
        userId: userInBlogDataResponse.userId,
        userName: userInBlogDataResponse.email,
      };

      const loadedBlog: BlogModel = {
        blogId: responseJson.blogId,
        blogUserId: userForBlog.userId,
        blogTitle: responseJson.blogTitle,
        blogContent: responseJson.blogContent,
        blogImg: responseJson.blogImg,
        author: responseJson.author,
        status: responseJson.status,
        approval: responseJson.approval,
        createdAt: responseJson.createdAt,
        createdBy: responseJson.createdBy,
        updatedAt: responseJson.updatedAt,
        updatedBy: responseJson.updatedBy,

      }
      // console.log(loadedBook);

      setBlog(loadedBlog);
      setIsLoading(false);

    };

    fetchBlogDetail().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });

  }, []);

  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }

  if (httpError) {
    return (
      <Page404 error={httpError} />
    )
  }

  let randomNum = Math.floor(Math.random() * 4) + 1;
  let imgAuthor = `blog-author${randomNum}.png`;
  return (
    <>
      <main id="main">

        <BlogDetailBanner />

        <section id="blog" className={styles.blogg}>
          <div className="container" data-aos="fade-up">
            <div className="row g-5">
              <div className="col-lg-8">
                <BlogDetailLeft blog={blog} />

                <div className={clsx(styles.postAuthor, "d-flex align-items-center")}>
                  <img src={require(`./../../../public/assets/img/blog/blog-author/${imgAuthor}`)} className="rounded-circle flex-shrink-0" alt="" />
                  <div>
                    <h4>Jane Smith</h4>
                    <div className={styles.socialLinks}>
                      <a href="https://twitters.com/#"><i className="bi bi-twitter"></i></a>
                      <a href="https://facebook.com/#"><i className="bi bi-facebook"></i></a>
                      <a href="https://instagram.com/#"><i className="biu bi-instagram"></i></a>
                    </div>
                    <p>
                      Itaque quidem optio quia voluptatibus dolorem dolor. Modi eum sed possimus accusantium. Quas repellat voluptatem officia numquam sint aspernatur voluptas. Esse et accusantium ut unde voluptas.
                    </p>
                  </div>
                </div>
                <BlogDetailComment blog={blog} />
              </div>
              <BlogDetailRight />
            </div>

          </div>
        </section>

      </main>
    </>
  );
}