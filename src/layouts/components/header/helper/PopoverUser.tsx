import {
  WalletOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearInfo } from "../../../../state/user/userSlice";
import { clearWeb3 } from "../../../../state/app/appSlice";
interface IItemPopover {
  icon: JSX.Element;
  title: string;
  onClick?: () => void;
}

interface IPopoverUser {
  hdNetworkChange: () => void;
  hdAccountChange: () => void;
}

const PopoverUser = (props:IPopoverUser ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listItemPopover: IItemPopover[] = [
    {
      icon: <WalletOutlined rev={""} className="popover-icon" />,
      title: "My Asset",
      onClick: () => navigate("/wallet"),
    },
    {
      icon: <ProfileOutlined rev={""} className="popover-icon" />,
      title: "Profile",
    },
    {
      icon: <LogoutOutlined rev={""} className="popover-icon" />,
      title: "Log out",
      onClick: () => {
        dispatch(clearInfo());
        dispatch(clearWeb3());
        window.ethereum.removeListener('accountsChanged', props.hdAccountChange);
        window.ethereum.removeListener('chainChanged', props.hdNetworkChange);
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
