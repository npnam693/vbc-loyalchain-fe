import { Divider } from "antd";

import "./TableOrder.scss";
import { shortenAddress } from "../../../utils/string";
import PairToken from "../../app/PairToken";

const baseTable = [
  {
    title: "ID",
    size: 0.1666,
  },
  {
    title: "Transaction",
    size:  0.1666,
  },
  {
    title: "Swap from",
    size:  0.1666,
  },
  {
    title: "Swap to",
    size:  0.1666,
  },
  {
    title: "Time create",
    size:  0.1666,
  },
  { title: "Time left", size:  0.1666 },
];

export default function TableOrder(props : any) {
  console.log('props', props)

  const standardizeData = props.data.map((item : any) => {
    // const itemData = {
    //   ID: "",
    //   Transaction: <></>,
    //   swapFrom: "",
    //   swapTo: "",
    //   timeCreate: Date(),
    //   timeLeft: '3h 50m 2s left'
    // }
    const itemData : any = []

    console.log(item._id)

    itemData.push(shortenAddress(String(item._id)))
    itemData.push(< PairToken from_img={item.fromValue.token.image} to_img={item.toValue.token.image} />)
    itemData.push(`${item.fromValue.amount} ${item.fromValue.token.symbol}`)
    itemData.push(`${item.toValue.amount} ${item.toValue.token.symbol}`)
    itemData.push(item.createdAt)
    itemData.push('3h 50m 2s left')
    return itemData
  })

  
  return (
    <div className="app-order_table">
      <div className="header">
        {baseTable.map((element, index) => (
          <div className="header-item" style={{ flex: element.size }}>
            {element.title}
          </div>
        ))}
      </div>

      <Divider className="divider" />

      <div className="list-content">
        {
          standardizeData.map((item : any, index : number) => (
            <div className="content-item">
              <div className="item-field">
                {item.map((element : any, index : number) => (
                  <div className="header-item" style={{ flex:  0.1666}}>
                    {element}
                  </div>
                ))}
            </div>
          </div>
          ))
        }
        
        
        {/* {mockData.map((value : any, index) => (
          <div className="content-item">
            <div className="item-field">
              {baseTable.map((element, index) => (
                <div className="header-item" style={{ flex: element.size }}>
                  {value[element.title]}
                </div>
              ))}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
