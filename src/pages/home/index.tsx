import React, { useState } from "react";
import { Button, FloatButton } from "antd";
import Lottie from "lottie-react";

import SVGIntro1 from "../../assets/svg/home/intro1.svg";
import SVGIntro2 from "../../assets/svg/home/intro2.svg";
import Logo from "../../assets/svg/logo_loyal-chain.svg";
import Gift_Lottie from "../../assets/lottie/gift.json";
import WhyChoose from "../../components/home/whychoose";
import Package from "../../components/home/package";
import Contact from "../../components/home/contact";
import "./Home.scss";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
export default function Home() {

  return (
    <div className="app-home">
      <div className="app-home--intro1">
        <div className="intro-left">
          <p className="title">
            Loyalty Point Exchange on Blockchain <br />
            Enhancing Partner Value
          </p>
          <p className="desc">
            Our platform leverages the transparency and immutability of
            blockchain to ensure the integrity of loyalty points transactions.
            Members can easily convert their accumulated points into digital
            tokens, providing them with a versatile and valuable asset. These
            tokens can be used to access a wide range of rewards, including
            exclusive products, services, discounts, or even cashback options.
          </p>
          <Button type="default" className="btn-1" size="large">
            Join now
          </Button>
          <Button type="primary" className="btn-2" size="large">
            Explore Marketplace
          </Button>
        </div>
        <div className="intro-right">
          <img src={SVGIntro1} alt="loyalChain" />
          <Lottie
            animationData={Gift_Lottie}
            loop={true}
            className="lottie-gift"
          />
        </div>
      </div>

      <div className="app-home--intro2">
        <div className="intro-left">
          <img src={SVGIntro2} alt="loyalChain" />
        </div>
        <div className="intro-right">
          <p className="title">
            Loyalty Point Exchange on Blockchain <br />
            Enhancing Partner Value
          </p>
          <p className="desc">
            Our platform leverages the transparency and immutability of
            blockchain to ensure the integrity of loyalty points transactions.
            Members can easily convert their accumulated points into digital
            tokens, providing them with a versatile and valuable asset. These
            tokens can be used to access a wide range of rewards, including
            exclusive products, services, discounts, or even cashback options.
          </p>

          <div className="btn-group">
            <Button type="default" className="btn-1" size="large">
              Join now
            </Button>
            <Button type="primary" className="btn-2" size="large">
              Explore Marketplace
            </Button>
          </div>
        </div>
      </div>

      <div className="app-home--whychoose">
        <p className="title">Why choose LoyalChain?</p>

        <div className="app-home--whychoose--pc">
          <div
            className="app-home--whychoose--list-1"
          >
            <WhyChoose
              size={2}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Lorem ipsum dolor sit amet, consectetur
              adipisicing elit, sed do eiusmod tempor
              incididunt Laoreet non curabitur gravida
              sagittis aliquam bibendum."
            />{" "}
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />
          </div>
          <div
            className="app-home--whychoose--list-2"
          >
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />{" "}
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />{" "}
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />{" "}
          </div>
        </div>

        <div className="app-home--whychoose--mobile">
          <div
            className="app-home--whychoose--list-1"
          >
            <WhyChoose
              size={2}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Lorem ipsum dolor sit amet, consectetur
              adipisicing elit, sed do eiusmod tempor
              incididunt Laoreet non curabitur gravida
              sagittis aliquam bibendum."
            />{" "}
          </div>
          <div
            className="app-home--whychoose--list-2"
          >
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />{" "}
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />{" "}
            <WhyChoose
              size={1}
              uriImg={SVGIntro2}
              title="Integration other"
              content="Easily integrate with all your need favorite tools through and APIsing including automatic "
            />{" "}
          </div>
        </div>




        
      </div>

      <div className="app-home--package">
        <p className="title">Choose the package that's right for you!</p>
        <div className="list-packages">
          <Package
            premium={false}
            type="Basic"
            money={500}
            contents={[
              "DIGITAL LOYALTY POINTS",
              "IMPLEMENTATION POINTS TRANSFER SYSTEM",
              "INTEGRATION WITH lOYALCHAIN SYSTEM",
            ]}
          />
          <Package
            premium={true}
            type="Basic"
            money={2000}
            contents={[
              "DIGITAL LOYALTY POINTS",
              "IMPLEMENTATION POINTS TRANSFER SYSTEM",
              "INTEGRATION WITH lOYALCHAIN SYSTEM",
              "NFT REWARDS",
              "LADING PAGE"
            ]}
          />
          <Package
            premium={false}
            type="Basic"
            money={1000}
            contents={[
              "DIGITAL LOYALTY POINTS",
              "IMPLEMENTATION POINTS TRANSFER SYSTEM",
              "INTEGRATION WITH lOYALCHAIN SYSTEM",
            ]}
          />
        </div>
      </div>

      <Contact />

      <div className="app-home--logo_tail">
        <img src={Logo} alt="loyalChain" />
      </div>


    </div>
  );
}
