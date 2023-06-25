import React from "react";
import SVGIntro1 from "../../assets/svg/home/intro1.svg";
import SVGIntro2 from "../../assets/svg/home/intro2.svg";
import { Button } from "antd";
import "./Home.scss";
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
      </div>
    </div>
  );
}
