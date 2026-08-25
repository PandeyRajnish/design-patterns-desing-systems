import { SplitScreen } from "./components/split-screen";
import { RegularList } from "./components/lists/Regular";
import { authors } from "./data/authors";
import { SmallAuthorListItem } from "./components/authors/SmallListItems";
import { LargeAuthorListItem } from "./components/authors/LargeListItems";
import { books } from "./data/books";
import { SmallBookListItem } from "./components/books/SmallListItems";
import { LargeBookListItem } from "./components/books/LargeListItems";
import { NumberedList } from "./components/lists/Numbered";

const LeftSideComp = ({ title }) => {
  return <h2 style={{ backgroundColor: "crimson" }}>{title}</h2>;
};

const RightSideComp = ({ title }) => {
  return <h2 style={{ backgroundColor: "burlywood" }}>{title}</h2>;
};

function App() {
  return (
    <>
      <SplitScreen leftWidth={1} rightWidth={3}>
        <LeftSideComp title="Left!" />
        <RightSideComp title="Right!" />
      </SplitScreen>

      <RegularList
        items={authors}
        sourceName="author"
        ItemComponent={SmallAuthorListItem}
      />

      <NumberedList
        items={authors}
        sourceName="author"
        ItemComponent={LargeAuthorListItem}
      />

      <RegularList
        items={authors}
        sourceName="author"
        ItemComponent={LargeAuthorListItem}
      />

      <RegularList
        items={books}
        sourceName="book"
        ItemComponent={SmallBookListItem}
      />
      <NumberedList
        items={books}
        sourceName="book"
        ItemComponent={LargeBookListItem}
      />
      <RegularList
        items={books}
        sourceName="book"
        ItemComponent={LargeBookListItem}
      />
    </>
  );
}

export default App;
