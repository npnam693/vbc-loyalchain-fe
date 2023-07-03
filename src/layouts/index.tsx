import React, { useEffect } from "react";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Container, Engine, ISourceOptions } from "tsparticles-engine";

import Header from "./components/header";
import Footer from "./components/footer/Footer";
import { LayoutProps } from "../types/route";
import { useAppDispatch } from "../state/hooks";
import Web3 from "web3";
import { saveWeb3 } from "../state/web3/web3Slice";
import { updateTokens } from "../state/token/tokenSlice";
import appApi from "../api/appAPI";


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
  const dispatch = useAppDispatch();
    useEffect(() => {
      async function fetchTokens() {
        const tokens = await appApi.getTokens();
        if (tokens){
          dispatch(updateTokens(tokens.data));
        }
    }
    
    async function fetchAccount() {
      const accounts = await window.ethereum.request({method: 'eth_accounts'});       
      if (accounts.length > 0) {
        const myWeb3 = new Web3(window.ethereum);
        dispatch(saveWeb3({ web3: myWeb3, isConnected: true }));
      }
    }
    fetchAccount()
    fetchTokens()
  }, [])    
  

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
      <div style={{ margin: "50px var(--app-margin) 0 var(--app-margin)" }}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
