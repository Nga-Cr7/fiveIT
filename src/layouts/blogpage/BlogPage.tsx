import styles from './css/blog.module.css';
import { Blog } from "./component/Blog";
import { BlogBanner } from "./component/BlogBanner";
import { useEffect, useState } from 'react';
import { BlogModel } from '../../models/BlogModel';
import { Pagination } from '../utils/Pagination';
import { SpinnerLoading } from '../utils/SpinnerLoading';
import { Page404 } from '../errors/Page404';
import { clsx } from 'clsx'
import { UserForBlogModel } from '../../models/UserForBlogModel';

export const BlogPage = () => {
    localStorage.removeItem("jobCate");
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [blogs, setBlogs] = useState<BlogModel[]>([]);
    const [blogperPage] = useState(6);

    // Handle pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);


    useEffect(() => {
        const fetchBlogs = async () => {
            const blogReponse = await fetch(`http://localhost:8080/api/blogs/search/findByStatusContainingAndApprovalContaining?status=ENABLE&approval=APPROVED&page=${currentPage - 1}&size=${blogperPage}`);
            const blogData = await blogReponse.json();
            console.log(blogData);

            const blogDataResponse = blogData._embedded.blogs;
            const loadedBlog: BlogModel[] = [];

            for (const key in blogDataResponse) {
                const userInBlogResponse = await fetch(
                    blogDataResponse[key]._links.user.href
                );
                if (!userInBlogResponse.ok) {
                    continue;
                }
                const userInBlogDataResponse = await userInBlogResponse.json();

                const userForBlog: UserForBlogModel = {
                    userId: userInBlogDataResponse.userId,
                    userName: userInBlogDataResponse.email,
                };

                const blog = new BlogModel(
                    blogDataResponse[key].blogId,
                    userForBlog.userId,
                    blogDataResponse[key].blogTitle,
                    blogDataResponse[key].blogContent,
                    blogDataResponse[key].blogImg,
                    blogDataResponse[key].author,
                    blogDataResponse[key].status,
                    blogDataResponse[key].approval,
                    blogDataResponse[key].createdAt,
                    blogDataResponse[key].createdBy,
                    blogDataResponse[key].updatedAt,
                    blogDataResponse[key].updatedBy,
                );
                loadedBlog.push(blog);
            }
            setBlogs(loadedBlog);
            setTotalPage(blogData.page.totalPages);
            setIsLoading(false);

        }
        fetchBlogs().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });

    }, [currentPage]);

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
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <>
            <BlogBanner />
            <section id="blog" className={clsx(styles.blog)}>
                <div className={clsx(styles.containerr)} data-aos="fade-up">
                    <div className={clsx(styles.postsList, "row gy-4")}  >
                        {blogs.length > 0 &&
                            blogs.map((blog) => <Blog blog={blog} key={blog.blogId} />)}
                    </div>

                    <div className="mt-3">
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            paginate={paginate} />
                    </div>
                   
                </div>
            </section>

        </>
    );
}