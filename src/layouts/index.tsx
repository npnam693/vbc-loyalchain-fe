import React, { useEffect } from "react";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Container, Engine, ISourceOptions } from "tsparticles-engine";

import Header from "./components/header";
import Footer from "./components/footer/Footer";
import { LayoutProps } from "../types/route";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { saveTokens } from "../state/app/appSlice";
import { Empty, FloatButton, Popover } from 'antd';

import appApi from "../api/appAPI";
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { openTaskModel } from "../state/task/taskSlice";
import PairToken from "../components/app/PairToken";
const Layout = ({ children }: LayoutProps) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
    },
    []
  );

  const taskState = useAppSelector((state) => state.taskState);
  const dispatch = useAppDispatch();
    useEffect(() => {
      async function fetchTokens() {
        const tokens = await appApi.getTokens();
        if (tokens){
          dispatch(saveTokens(tokens.data));
        }
      }
    fetchTokens()
  }, [])    
  

  const getTitleTask = (type: string)  => {

    console.log('DCM', type)

    switch (type) {
      case "TRANSFER":
        return "Transfer Token";
      case "ACCEPT":
        return "Accept Order";
      case "CREATE":
        return "Create Order";
      case "SELLER-CREATE":
        return "Create Order";
      case "REMOVE":
        return "Remove Order"
      case  "SELLER-REMOVE":
        return "Remove Order"
      default:
        return "Task";
    }
  }
  const contentTaskPopover = () => {
    return (
      <div style={{height: 300, minWidth: 500, overflow: 'scroll', cursor: 'pointer'}}>
        {
          taskState.taskList.length === 0 ?
          <Empty /> :
          taskState.taskList.map((task, index) => {
            return (
              <div key={index} style={{ 
                display:'flex', flexDirection:'row', alignItems:"center", 
                padding: "5px 20px",   margin: "5px 0", borderRadius: 3, 
                backgroundColor: 'rgba(219, 219, 219, 0.5)'}}
                
                onClick={() => dispatch(openTaskModel(index))}
              >
                <div style={{margin: "0 16px 0 -10px"}}>
                  {
                      (task.status === 1 || task.status === 2 || task.status === 0) ?
                        <LoadingOutlined rev={""} style={{fontSize: '2.5rem', color:"var(--color-secondary)"}}/>
                      :
                      (
                        task.status === 3 ? <CheckCircleTwoTone twoToneColor="#52c41a" rev={""} style={{fontSize: '2.5rem'}}/> 
                        : <CloseCircleTwoTone twoToneColor={"rgba(252, 75, 75, 1)"} rev={""} style={{fontSize: '2.5rem'}}/>
                      )
                  }
                </div>
                <div>
                  <p style={{fontSize: '1.4rem', fontWeight: 500}}>
                  {
                   getTitleTask(task.type)
                  }
                  </p>
                  <p style={{fontSize: '1.2rem'}}>Task ID: #0{task.id}
                    <span style={{marginLeft: 10}}>Step: {
                      task.status === 2 ? 'Send Token' : (task.status === 3 ? 'Done' : (task.status < 2 ? 'In Progress' : 'Fail'))
                    }</span>
                  </p>
                </div>
                
                <div style={{marginLeft: 'auto'}}>
                  {
                    task.type === "TRANSFER" ? 
                      <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <p style={{fontWeight: 500, marginRight: 10}}>{task.from.amount} {task.from.token.symbol}</p>
                        <img src={task.from.token ? task.from.token.image : 'token'} alt={""} style={{height: 30}}/>
                      </div>
                    :
                      <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <p style={{fontWeight: 500, marginRight: -10}}>{task.from.amount} {task.from.token.symbol}</p>
                        <PairToken from_img={task.from.token.image} to_img={task.to?.token.image} width={30}/>
                        <p style={{fontWeight: 500, marginLeft: -10}}>{task.to?.amount} {task.to?.token.symbol}</p>
                    </div>
                  }
                </div>

              </div>
            )
          })
        }
      </div>
    )
  }
  return (
    <>
      <div className="gradient"></div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={toptions}
      />
      <Header />
      <div style={{ height: "var(--header-height)" }}></div>
      <div style={{ margin: "30px var(--app-margin) 0 var(--app-margin)" }}>
        {children}
      </div>


      <Popover placement="leftBottom" title={'Your task'} content={contentTaskPopover} trigger="click">
        <FloatButton shape="square" icon={
          // <LoadingOutlined rev={""} style={{fontSize: '2.5rem', color:"var(--color-secondary)"}}/>
          taskState.tasksInProgress !== 0 &&
          <SyncOutlined spin rev={""}/>
        }/>
      </Popover>

      <Footer />
    </>
  );
};


const toptions: ISourceOptions = {
  name: "Polygon Mask",
  interactivity: {
    events: {
      onClick: {
        enable: false,
        mode: "push",
      },
      onDiv: {
        elementId: "repulse-div",
        enable: false,
        mode: "repulse",
      },
      onHover: {
        enable: true,
        mode: "bubble",
        parallax: {
          enable: false,
          force: 2,
          smooth: 10,
        },
      },
    },
    modes: {
      bubble: {
        distance: 40,
        duration: 2,
        opacity: 8,
        size: 6,
      },
      connect: {
        distance: 80,
        links: {
          opacity: 0.5,
        },
        radius: 60,
      },
      grab: {
        distance: 400,
        links: {
          opacity: 1,
        },
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      slow: {
        active: false,
        radius: 0,
        factor: 1,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      blink: false,
      color: "#ffffff",
      consent: false,
      distance: 30,
      enable: true,
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      outModes: "bounce",
      speed: 1,
    },
    number: {
      limit: 0,
      value: 200,
    },
    opacity: {
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
      value: {
        min: 0.05,
        max: 0.4,
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: 1,
    },
  },
  polygon: {
    draw: {
      enable: true,
      lineColor: "rgba(255,255,255,0.2)",
      lineWidth: 1,
    },
    enable: true,
    move: {
      radius: 10,
    },
    position: {
      x: 50,
      y: 50,
    },
    inline: {
      arrangement: "equidistant",
    },
    scale: 0.5,
    type: "inline",
    url: "https://particles.js.org/images/smalldeer.svg",
  },
};
export default Layout;
