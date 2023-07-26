import React, { useState } from "react";
import { Button, FloatButton } from "antd";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

import SVGIntro1 from "../../assets/svg/home/intro1.svg";
import SVGIntro2 from "../../assets/svg/home/intro2.svg";

import WhyConnect from '../../assets/svg/home/whychoose-connect.svg'
import WhyExchange from '../../assets/svg/home/whychoose-exchange.svg'
import WhyReward from '../../assets/svg/home/whychoose-rewards.svg'
import WhySecurity from '../../assets/svg/home/whychoose-img1.svg'

import Logo from "../../assets/svg/logo_loyal-chain.svg";
import Gift_Lottie from "../../assets/lottie/gift.json";
import WhyChoose from "../../components/home/whychoose";
import Package from "../../components/home/package";
import Contact from "../../components/home/contact";
import "./Home.scss";
export default function Home() {
  const navigate = useNavigate();
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
          <Button type="default" className="btn-1" size="large"
            onClick={() => navigate("/faucet")}
          >
            Join now
          </Button>
          <Button type="primary" className="btn-2" size="large"
            onClick={() => navigate("/marketplace")}
          >
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
            <Button type="default" className="btn-1" size="large"
              onClick={() => navigate("/faucet")}

            >
              Join now
            </Button>
            <Button type="primary" className="btn-2" size="large"
              onClick={() => navigate("/market")}
            >
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
              content="The Loyalchain solution has successfully integrated numerous renowned brands such as Starbucks, 
              McDonald's, Walmart, and more. Loyalchain enables your loyalty program to reach the rest of the world, 
              opening up significant opportunities to attract customers and establish connections with other businesses."
            />{" "}
            <WhyChoose
              size={1}
              uriImg={WhyExchange}
              title="Point Exchange"
              content="Loyalchain focuses on creating a mechanism that allows users 
              to exchange ERC20 loyalty points peer-to-peer, even when they are on different 
              networks, based on proprietary technology."
            />{" "}
          </div>

          : 
          <div
            className="app-home--whychoose--list-2"
          >

        <WhyChoose
              size={1}
              uriImg={WhyReward}
              title="Reward Redemption"
              content="Loyalchain also enables businesses to deploy NFT rewards for customers 
              directly using blockchain technology. Users can use 
              their accumulated loyalty points to redeem these NFT rewards."
            />
            <WhyChoose
              size={1}
              uriImg={WhyConnect}
              title="Interoperability"
              content="The main strengths of Loyalchain is ability to connect and facilitate transactions 
              between diverse loyalty programs, providing users with a more comprehensive and flexible rewards ecosystem."
            />{" "}
            <WhyChoose
              size={1}
              uriImg={WhySecurity}
              title="Transparency and Trust"
              content="Blockchain's inherent transparency ensures that all loyalty program builds 
              trust among users, as they can verify the authenticity of each reward and point transfer."
            />
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
              content="The Loyalchain solution has successfully integrated numerous renowned brands such as Starbucks, 
              McDonald's, Walmart, and more. Loyalchain enables your loyalty program to reach the rest of the world, 
              opening up significant opportunities to attract customers and establish connections with other businesses."
            />{" "}

          </div>
          <div
            className="app-home--whychoose--list-2"
          >
            <WhyChoose
              size={1}
              uriImg={WhyExchange}
              title="Point Exchange"
              content="Loyalchain focuses on creating a mechanism that allows users 
              to exchange ERC20 loyalty points peer-to-peer, even when they are on different 
              networks, based on proprietary technology."
            />{" "}

            <WhyChoose
              size={1}
              uriImg={WhyReward}
              title="Reward Redemption"
              content="Loyalchain also enables businesses to deploy NFT rewards for customers 
              directly using blockchain technology. Users can use 
              their accumulated loyalty points to redeem these NFT rewards."
            />
            <WhyChoose
              size={1}
              uriImg={WhyConnect}
              title="Interoperability"
              content="The main strengths of Loyalchain is ability to connect and facilitate transactions 
              between diverse loyalty programs, providing users with a more comprehensive and flexible rewards ecosystem."
            />{" "}
            <WhyChoose
              size={1}
              uriImg={WhySecurity}
              title="Transparency and Trust"
              content="Blockchain's inherent transparency ensures that all loyalty program builds 
              trust among users, as they can verify the authenticity of each reward and point transfer."
            />
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
