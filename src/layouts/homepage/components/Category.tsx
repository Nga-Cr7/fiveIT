import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next"

interface JobCategoryModelForHome {
    categoryId: string;
    categoryName: string;
    categoryImg: string;
    createdAtL: string;
    jobCount: number;
  }
  
  export const Category = () => {
    const { t } = useTranslation();
    const [jobCate, setJobCate] = useState<JobCategoryModelForHome[]>([]);
  
    useEffect(() => {
      const fetchCate = async () => {
        const jobCateURL = "http://localhost:8080/api/jobCate";
        try {
          const [jobCategoryResponse] = await Promise.all([
            fetch(jobCateURL),
          ]);
  
          if (!jobCategoryResponse.ok) {
            throw new Error("Something went wrong with one of the requests");
          }
  
          const [jobCatesData] = await Promise.all([
            jobCategoryResponse.json(),
          ]);
  
          // Fetch job count for each category
          const countPromises = jobCatesData.map(async (cate: JobCategoryModelForHome) => {
            const jobCountURL = `http://localhost:8080/api/jobs/search/getCountJobByCate?categoryId=${cate.categoryId}`;
            const response = await fetch(jobCountURL);
            const data = await response.json();
            return {
              ...cate,
              jobCount: data,
            };
           
          });
  
          const loadedCate = await Promise.all(countPromises);
  
          setJobCate(loadedCate);
        } catch (error: any) {
        }
      };
  
      fetchCate();
    }, []);


    const handleCategoryClick = (categoryId: any) => {
        localStorage.setItem("jobCate", categoryId);

    };

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">{t("home.category.exploreCate")}</h1>
                <div className="row g-4 text-center">
                    {jobCate.length > 0 && jobCate.map((cate) => (
                        <Link
                            key={cate.categoryId} // Add a unique key prop here
                            className="col-lg-3 col-sm-6 wow fadeInUp"
                            data-wow-delay="0.1s"
                            onClick={() => handleCategoryClick(cate.categoryId)}
                            to={`/jobs`}
                        >
                            <div className="cat-item rounded p-4">
                                <div className="image-container">
                                    <img
                                        src={cate.categoryImg}
                                        alt="Category Image"
                                        className="img-fluid rounded-circle mb-4"
                                        style={{ width: "80px", height: "80px", objectFit:'cover' }}
                                    />
                                </div>
                                <h6 className="mb-3">{cate.categoryName}</h6>
                                <p className="mb-0">{cate.jobCount} {t("home.category.jobs")}</p>
                            </div>

                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
};