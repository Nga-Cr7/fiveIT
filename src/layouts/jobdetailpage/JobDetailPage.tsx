import { useState, useEffect } from "react";
import { JobDetailBanner } from "./components/JobDetailBanner";
import { LeftContent } from "./components/LeftContent"
import { RightContent } from "./components/RightContent";
import { JobModel } from "../../models/JobModel";
import { JobCategoryModel } from "../../models/JobCategoryModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { Page404 } from "../errors/Page404";
import { useLocation, useParams } from "react-router-dom";

export function JobDetailPage() {
  const [job, setJob] = useState<JobModel>();
  // Handle loading + Errors
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const jobId = window.location.pathname.split("/").pop();


  useEffect(() => {
    const fetchJob = async () => {
      const url = `http://localhost:8080/api/jobs/${jobId}`;

      // console.log("Url: ", url)
      const cateUrl = url + "/jobCategory";
      const userUrl = url + "/user";

      const response = await fetch(url);
      const categoryResponse = await fetch(cateUrl);
      const userResponse = await fetch(userUrl);


      if (!response.ok || !categoryResponse.ok || !userResponse.ok) {
        throw new Error("Something went wrong");
      }

      const responseJson = await response.json();
      const categoryData = await categoryResponse.json();
      const userData = await userResponse.json();

      // Create a CategoryModel instance
      const cateForJob: JobCategoryModel = {
        categoryId: categoryData.categoryId,
        categoryName: categoryData.categoryName,
        categoryImg: categoryData.categoryImg,
        createdAt : categoryData.createdAt
      };


      const loadedJob: JobModel = {
        jobId: responseJson.jobId,
        title: responseJson.title,
        jobCategory: cateForJob,
        userId: userData.userId,
        jobImg: responseJson.jobImg,
        description: responseJson.description,
        requirements: responseJson.requirements,
        location: responseJson.location,
        salary: responseJson.salary,
        status: responseJson.status,
        applicationDeadline: responseJson.applicationDeadline,
        createdAt: responseJson.createdAt,
        createdBy: responseJson.createdBy,
        approval: responseJson.approval,
        quantityCv: responseJson.quantityCv,
      }
      // console.log(loadedBook);

      setJob(loadedJob);

      setIsLoading(false);

    };

    fetchJob().catch((error: any) => {
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
      <Page404 error={httpError}/>
    )
  }


  return (
    <>
      <JobDetailBanner/>
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="row gy-5 gx-4">
            <LeftContent job={job} />
            <RightContent job={job}/>
          </div>
        </div>
      </div>

    </>
  );

}
