import React, { useEffect, useState } from 'react'
import './myOrder.scss'
import appApi from '../../../api/appAPI'
import { Segmented } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import MyOrderItem from '../../../components/marketplace/MyOrderItem';
import { useAppSelector } from '../../../state/hooks';

interface IDataOrder {
    pendingOrder: any[],
    inprogressOrder: any[]
} 
const MyOrder = () => {


    const [dataFetch, setdataFetch] =  useState<IDataOrder>({
        pendingOrder: [],
        inprogressOrder: []
    })
    const [pageName, setPageName] = useState<string>('inprogressOrder')

    const userState = useAppSelector(state => state.userState)
    useEffect(() => {
        const fetchData = async () => {
            const res = await appApi.getOrderInprogess()
            console.log(res?.data)
            if (res){
                let pendingOrder : any[] = []
                let inprogressOrder: any[] = [] 
                for (let i = 0; i < res.data.length; i++){
                    if (res.data[i].status === "pending")
                        pendingOrder = [res.data[i], ...pendingOrder]
                    else {
                        inprogressOrder = [res.data[i], ...inprogressOrder]
                    }
                }
                setdataFetch({pendingOrder, inprogressOrder})
            }
        }
        console.log('vcl thật')
        fetchData()
    }, [userState.address])
  return (
    <div className='app-myOrder'>      
        <p className="title">Marketplace / My Order</p>
        <Segmented 
            onChange={(value) => setPageName(String(value))}
            options={[
            {
                label: 'In progress Order',
                value: 'inprogressOrder',
                icon: <AppstoreOutlined rev={""}/>,
            },
            {
                label: 'Pending Order',
                value: 'pendingOrder',
                icon: <BarsOutlined rev={""}/>,
            },
        ]}/>
        <div className='list-order'>
            {
                pageName === 'inprogressOrder' ?
                dataFetch.inprogressOrder.map((item, index) => (
                    <MyOrderItem data = {item}/>
                ))
                :
                dataFetch.pendingOrder.map((item, index) => (
                    <MyOrderItem data={item} isPendingOrder/>
                ))
            }    
        </div>
  </div>
  )
}

export default MyOrder