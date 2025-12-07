import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import PageTransition from '../components/PageTransition'
import FadeIn from '../components/FadeIn'

const Home = () => {
  return (
    <PageTransition>
      <div className='bg-white'>
        <FadeIn delay={0.1}>
          <Hero />
        </FadeIn>
        <FadeIn delay={0.2}>
          <LatestCollection/>
        </FadeIn>
        <FadeIn delay={0.3}>
          <BestSeller />
        </FadeIn>
        <FadeIn delay={0.4}>
          <OurPolicy />
        </FadeIn>
        <FadeIn delay={0.5}>
          <NewsletterBox />
        </FadeIn>
      </div>
    </PageTransition>
  )
}

export default Home