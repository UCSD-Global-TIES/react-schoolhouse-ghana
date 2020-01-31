import React, {
  useEffect,
  useState
} from "react";

import {
  Route,
  Switch
} from "react-router-dom";

import "./App.css";


// COMPONENTS
// -----------------------------------------------------------
// Component that ensures people are logged in and have proper permissions
// Using Redirect https://reacttraining.com/react-router/web/api/Redirect
import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading";

// PAGES
import NoMatch from "./pages/NoMatch/index";
import LoginPortal from "./pages/LoginPortal/index";
import AccountPortal from "./pages/AccountPortal/index";
import ClassPage from "./pages/ClassPage/index";

function App() {

  const [userInfo, setUserInfo] = useState({type: "student", classes: ["123"]});
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if(!loading) { setUserInfo(user) }
  // }, [loading]);

  // if (loading) {
  //   return (
  //     <div className="App text-center">
  //       <div>
  //         <Loading />
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="App">
      <header>
        {/* Place navigation bar here */}
      </header>
      <Switch>
        {/* Portal component should check account type and render the correct component */}
        <ProtectedRoute exact path="/" component={AccountPortal} user={userInfo} />
        {/* Class component should check account type and render the correct component */}
        <ProtectedRoute exact path="/class/:id" component={ClassPage} user={userInfo} />
        <Route exact path="/login" component={LoginPortal} user={userInfo} />
        <Route component={NoMatch} />        
      </Switch>
    </div>
  );
}

export default App;