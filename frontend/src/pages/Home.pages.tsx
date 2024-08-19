import Hero from '../components/Hero/Hero.components'
import Solution from '../components/Solution/Solution'
import Benefit from '../components/Benefits/Benefits.components'
import Features from '../components/Features/Features.components'
import Reviews from '../components/Reviews/Review.components'
import Faq from '../components/FAQ/Faq.components'



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