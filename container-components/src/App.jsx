import { CurrentUserLoader } from "./components/current-user-loader";
import { UserInfo } from "./components/user-info";
import { UserLoader } from "./components/user-loader";

function App() {
  return (
    <>
      {/*  current user */}
      <CurrentUserLoader>
        <UserInfo />
      </CurrentUserLoader>

      {/* user loader */}
      <UserLoader userId={"3"}>
        <UserInfo />
      </UserLoader>

      <UserLoader userId={"2"}>
        <UserInfo />
      </UserLoader>

      <UserLoader userId={"1"}>
        <UserInfo />
      </UserLoader>
    </>
  );
}

export default App;
