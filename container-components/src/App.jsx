import axios from "axios";
import { BookInfo } from "./components/book-info";
import { CurrentUserLoader } from "./components/current-user-loader";
import { DataSource } from "./components/data-source";
import { ResourceLoader } from "./components/resource-loader";
import { UserInfo } from "./components/user-info";
import { UserLoader } from "./components/user-loader";
import { DataSourceWithRender } from "./components/data-source-with-render";

const getDataFromServer = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getDataFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

const Message = ({ msg }) => <h1>{msg}</h1>;

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

      {/* data source */}
      <h2>Data Source with Render Promps pattern</h2>
      <hr />
      <DataSourceWithRender
        getData={() => fetchData("/users/2")}
        render={(resource) => <UserInfo user={resource} />}
      ></DataSourceWithRender>

      {/* data source  load the data from the local storage*/}
      <h2>Load the data from the local Storage</h2>
      <hr />
      <DataSource
        getData={() => getDataFromLocalStorage("test")}
        resourceName={"msg"}
      >
        <Message />
      </DataSource>
    </>
  );
}

export default App;
