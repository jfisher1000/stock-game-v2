import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { Link } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

//redux
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const ProfileMenu = (props: any) => {
  // const { success } = useSelector((state: any) => ({
  //   success: state.profile.success,
  // }));

  const profiledata = createSelector(

    (state: any) => state.profile,
    (state) => ({
      success: state.success,
    })
  );
  // Inside your component
  const { success } = useSelector(profiledata);

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState<boolean>(false);

  const [username, setusername] = useState("Admin");

  useEffect(() => {
    const getAuthUser = localStorage.getItem("authUser");
    if (getAuthUser) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(getAuthUser);
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(getAuthUser);
        setusername(obj.username);
      }
    }
  }, [success]);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-1 fw-medium">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">

          <Link to={"/profile"} className="dropdown-item">
            <i className="mdi mdi mdi-face-man font-size-16 align-middle me-1"></i>{" "}
            {props.t("Profile")}{" "}
          </Link>{" "}

          <Link to="/page-lock-screen" className="dropdown-item">
            <i className="mdi mdi-lock font-size-16 align-middle me-1"></i>
            {props.t("Lock screen")}
          </Link>

          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="mdi mdi-logout font-size-16 align-middle me-1"></i>
            <span>{props.t("Logout")}</span>
          </Link>

        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};
export default withTranslation()(ProfileMenu);
