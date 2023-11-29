import { HomePageBanner } from "./components/HomePageBanner";
import { About } from "./components/About";
import { Category } from "./components/Category";
import { Testimonial } from "./components/Testimonial";
export function HomePage() {
  localStorage.removeItem("jobCate");
  return (
    <div>
      <HomePageBanner />
      <Category />
      <About />
      <Testimonial />
    </div>

  )
}