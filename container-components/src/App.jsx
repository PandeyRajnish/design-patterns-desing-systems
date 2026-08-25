import axios from "axios";
import { BookInfo } from "./components/book-info";
import { CurrentUserLoader } from "./components/current-user-loader";
import { DataSource } from "./components/data-source";
import { ResourceLoader } from "./components/resource-loader";
import { UserInfo } from "./components/user-info";
import { UserLoader } from "./components/user-loader";

const getDataFromServer = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

function App() {
  return (
    <>
      {/*  current user */}
      <h2>Current User Loader</h2>
      <hr />
      <CurrentUserLoader>
        <UserInfo />
      </CurrentUserLoader>

      {/* user loader */}
      <h2>User Loader</h2>
      <hr />
      <UserLoader userId={"3"}>
        <UserInfo />
      </UserLoader>

      <UserLoader userId={"2"}>
        <UserInfo />
      </UserLoader>

      <UserLoader userId={"1"}>
        <UserInfo />
      </UserLoader>

      {/* resource loader */}
      <h2>Resource Loader</h2>
      <hr />
      <ResourceLoader resourceUrl={"/users/2"} resourceName={"user"}>
        <UserInfo />
      </ResourceLoader>

      <ResourceLoader resourceUrl={"/books/2"} resourceName={"book"}>
        <BookInfo />
      </ResourceLoader>

      {/* data source */}
      <h2>Data Source</h2>
      <hr />
      <DataSource
        getData={() => getDataFromServer("/users/2")}
        resourceName={"user"}
      >
        <UserInfo />
      </DataSource>
    </>
  );
}

export default App;
