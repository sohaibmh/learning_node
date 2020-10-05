import React from "react";
import { connect } from "react-redux";

const Header = (props) => {
  const renderContent = () => {
    switch (props.auth) {
      case null:
        return "Still deciding";
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return (
          <li>
            <a>Logout</a>
          </li>
        );
    }
  };

  console.log("props", props);

  return (
    <nav>
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">
          Emaily
        </a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          {renderContent()}
        </ul>
      </div>
    </nav>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(Header);
