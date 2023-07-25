
import { Spin } from 'antd'
import { useAppSelector } from '../../../state/hooks'
import React from 'react'

const LoadingPage = () => {
    const loadingState = useAppSelector((state) => state.loadingState)
    return (
    loadingState ?
    <div style={{width: '100vw', height: '100vh', backgroundColor:"rgba(0,0,0,0.5)", position:'fixed', zIndex:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Spin tip="Loading" size='large'/>
    </div>
    :
    <></>
  )
}

export default LoadingPage