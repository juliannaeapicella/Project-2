const handleLogin = (e) => {
  e.preventDefault();

  $("#plantMessage").animate({width:'hide'},350);

  if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("Username or password is empty.");
      return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  $("#plantMessage").animate({width:'hide'},350);

  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("All fields are required.");
      return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
      handleError("Passwords do not match.");
      return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

const handlePasswordChange = (e) => {
  e.preventDefault();

  $("#plantMessage").animate({width:'hide'},350);

  if($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
      handleError("All fields are required.");
      return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
      handleError("Passwords do not match.");
      return false;
  }

  sendAjax('PUT', $("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize(), redirect);

  return false;
};

const LoginWindow = (props) => {
  return (
    <form id="loginForm" name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
      >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign In" />

    </form>
  );
};

const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
  );
};

const PasswordChangeWindow = (props) => {
  return (
    <form id="passwordChangeForm"
      name="passwordChangeForm"
      onSubmit={handlePasswordChange}
      action="/changePassword"
      method="PUT"
      className="mainForm"
    >
      <label htmlFor="oldPass">Verify Password: </label>
      <input id="oldPass" type="password" name="oldPass" placeholder="password" />
      <label htmlFor="newPass">New Password: </label>
      <input id="newPass" type="password" name="newPass" placeholder="new password" />
      <label htmlFor="newPass2">Retype New Password: </label>
      <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  );
};

const createLoginWindow = (csrf) => {
  ReactDOM.render(
      <LoginWindow csrf={csrf} />,
      document.querySelector("#content")
  );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createPasswordChangeWindow = (csrf) => {
  ReactDOM.render(
      <PasswordChangeWindow csrf={csrf} />,
      document.querySelector("#content")
  );
};

const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  if (signupButton && loginButton) {
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });
  

    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  
    createLoginWindow(csrf);
  } else {
    createPasswordChangeWindow(csrf);
  }
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
  getToken();
});