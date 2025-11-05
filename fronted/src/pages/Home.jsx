import React from 'react'
import MainBanner from '../components/MainBanner'
import Category from '../components/Category'
import BestSeller from '../components/BestSeller'
import NewsLetter from '../components/NewsLetter'
import BottomBanner from '../components/BottomBanner'

const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Category/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/>
      
    </div>
  )
}

export default Home
