import React from 'react'
import Header from './components/header/Header'
import { LayoutProps } from '../types/route'
import Footer from './components/footer/Footer'

const Layout = ({ children } : LayoutProps)   => {
  return (
    <>
        <div className='gradient'>
        </div>  
        <Header />
        {children}
        <Footer />
    </>
  )
}

export default Layout