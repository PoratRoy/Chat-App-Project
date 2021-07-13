import "./Search.css";

const Search = ({ handleSearch }) => {
  return (
    <div className="search">
      <input className="txt" placeholder="Search" onChange={handleSearch} />
      <i className="fas fa-search search-icon"></i>
    </div>
  );
};

export default Search;
