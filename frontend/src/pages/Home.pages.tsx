import Hero from '../components/Home Page Components/Hero/Hero.components'
import Solution from '../components/Home Page Components/Solution/Solution'
import Benefit from '../components/Home Page Components/Benefits/Benefits.components'
import Features from '../components/Home Page Components/Features/Features.components'
import Reviews from '../components/Home Page Components/Reviews/Review.components'
import Faq from '../components/Home Page Components/FAQ/Faq.components'



function HomePage() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{backgroundColor:"#fff"}}>
      <div className="flex-grow-1">
        <Hero />
        <Solution />
        <Benefit />
        <Features />
        <Reviews />
        <Faq />
      </div>

        
        
    </div>
  )
}

export default HomePage