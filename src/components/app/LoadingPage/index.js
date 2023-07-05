
import React from 'react'
import { Spin } from 'antd'
import { useAppSelector } from '../../../state/hooks'


const LoadingPage = () => {
    const loadingState = useAppSelector((state) => state.loadingState)
    return (
    loadingState.isLoading ?
    <div style={{width: '100vw', height: '100vh', backgroundColor:"rgba(0,0,0,0.5)", position:'fixed', zIndex:5, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Spin tip="Loading" size='large'/>
    </div>
    :
    <></>
  )
}

export default LoadingPage