import {
  WalletOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

interface IItemPopover {
  icon: JSX.Element;
  title: string;
}
const listItemPopover: IItemPopover[] = [
  {
    icon: <WalletOutlined rev={""} className="popover-icon" />,
    title: "My Asset",
  },
  {
    icon: <ProfileOutlined rev={""} className="popover-icon" />,
    title: "Profile",
  },
  {
    icon: <LogoutOutlined rev={""} className="popover-icon" />,
    title: "Log out",
  },
];

const PopoverUser = () => {
  return (
    <div className="header-popover_user">
      {listItemPopover.map((item, index) => (
        <div className="container-item">
          {item.icon}
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default PopoverUser;
