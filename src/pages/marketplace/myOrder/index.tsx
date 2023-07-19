import React, { useEffect, useState } from 'react'
import './myOrder.scss'
import appApi from '../../../api/appAPI'
import { Segmented } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import Order from '../../../components/marketplace/Order';


interface IDataOrder {
    pendingOrder: any[],
    inprogressOrder: any[]
} 
const MyOrder = () => {
    const [dataFetch, setdataFetch] =  useState<IDataOrder>({
        pendingOrder: [],
        inprogressOrder: []
    })
    const [dataOrder, setDataOrder] = useState<any[]>([])

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
                setDataOrder(inprogressOrder)
            }
        }
        fetchData()
    }, [])
  return (
    <div className='app-myOrder'>      
        <p className="title">Marketplace / My Order</p>
        <Segmented 
            onChange={(value) => value === 'pendingOrder' ?  
                setDataOrder(dataFetch['pendingOrder']) : setDataOrder(dataFetch['inprogressOrder'])}
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
                dataOrder.map((item, index) => (
                    <Order data = {item}/>
                ))
            }
        </div>
  </div>
  )
}

export default MyOrder