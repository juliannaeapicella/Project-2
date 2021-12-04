// log in user
const handleLogin = (e) => {
  e.preventDefault();

  if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("Username or password is empty.");
      return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// sign up user
const handleSignup = (e) => {
  e.preventDefault();

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

// react component for login form
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

// react component for signup form
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
      <label htmlFor="pass2">Retype Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
  );
};

// renders the login window
const createLoginWindow = (csrf) => {
  ReactDOM.render(
      <LoginWindow csrf={csrf} />,
      document.querySelector("#content")
  );
};

// renders the signup window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// set up starting components on page
const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.currentTarget.classList.add("current");
      loginButton.classList.remove("current");
      createSignupWindow(csrf);
      return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("current");
    signupButton.classList.remove("current");
    createLoginWindow(csrf);
    return false;
  });
  
  loginButton.classList.add("current");
  createLoginWindow(csrf);
};

// get CSRF token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
  getToken();
});