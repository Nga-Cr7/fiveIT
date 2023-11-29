import { Link } from "react-router-dom";
import styles from "../css/blog.module.css";
import clsx from "clsx";

export const BlogDetailRight = () => {
  return (
    <>
      <div className="col-lg-4">
        <div className={styles.sidebar}>
          <div className={clsx(styles.sidebarItem, styles.searchForm)}>
            <h3 className={styles.sidebarTitle}>Search</h3>
            <form action="" className="mt-3">
              <input type="text" />
              <button type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
          <div className={clsx(styles.sidebarItem, styles.categories)}>
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <ul className="mt-3">
              <li>
                <Link to="#">
                  General <span>(25)</span>
                </Link>
              </li>
              <li>
                <Link to="#">
                  Lifestyle <span>(12)</span>
                </Link>
              </li>
              <li>
                <Link to="#">
                  Travel <span>(5)</span>
                </Link>
              </li>
              <li>
                <Link to="#">
                  Design <span>(22)</span>
                </Link>
              </li>
              <li>
                <Link to="#">
                  Creative <span>(8)</span>
                </Link>
              </li>
              <li>
                <Link to="#">
                  Educaion <span>(14)</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={clsx(styles.sidebarItem, styles.recentPosts)}>
            <h3 className={styles.sidebarTitle}>Recent Posts</h3>

            <div className="mt-3">
              <div className={clsx(styles.postItem, "mt-3")}>
                {/* <img src="../assets/img/blog/blog1.png" alt="" /> */}
                <div>
                  <h4>
                    <Link to="blog-details.html">
                      Nihil blanditiis at in nihil autem
                    </Link>
                  </h4>
                  <time dateTime="2020-01-01">Jan 1, 2020</time>
                </div>
              </div>
            </div>
          </div>

          <div className={clsx(styles.sidebarItem, styles.tags)}>
            <h3 className={styles.sidebarTitle}>Tags</h3>
            <ul className="mt-3">
              <li>
                <Link to="#">App</Link>
              </li>
              <li>
                <Link to="#">IT</Link>
              </li>
              <li>
                <Link to="#">Business</Link>
              </li>
              <li>
                <Link to="#">Mac</Link>
              </li>
              <li>
                <Link to="#">Design</Link>
              </li>
              <li>
                <Link to="#">Office</Link>
              </li>
              <li>
                <Link to="#">Creative</Link>
              </li>
              <li>
                <Link to="#">Studio</Link>
              </li>
              <li>
                <Link to="#">Smart</Link>
              </li>
              <li>
                <Link to="#">Tips</Link>
              </li>
              <li>
                <Link to="#">Marketing</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
