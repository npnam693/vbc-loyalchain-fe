import {
  WalletOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
interface IItemPopover {
  icon: JSX.Element;
  title: string;
  onClick?: () => void;
}

interface IPopoverUser {
  onClickLogout: () => void;
}

const PopoverUser = ({ onClickLogout }:IPopoverUser ) => {
  const navigate = useNavigate();
  const listItemPopover: IItemPopover[] = [
    {
      icon: <WalletOutlined rev={""} className="popover-icon" />,
      title: "My Asset",
      onClick: () => navigate("/wallet"),
    },
    {
      icon: <ProfileOutlined rev={""} className="popover-icon" />,
      title: "My Order",
      onClick: () => navigate("/marketplace/my-order"),
    },
    {
      icon: <LogoutOutlined rev={""} className="popover-icon" />,
      title: "Log out",
      onClick: () => {
        onClickLogout()
      },
    },
  ];
  return (
    <div className="header-popover_user">
      {listItemPopover.map((item, index) => (
        <div
          className="container-item"
          onClick={() => item.onClick && item.onClick()}
          key={index}
        >
          {item.icon}
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default PopoverUser;
