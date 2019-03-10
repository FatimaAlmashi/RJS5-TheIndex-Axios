import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    error: null,
    loading: true
  };

  async componentDidMount() {
    try {
      const response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      const authors = response.data;
      this.setState({
        loading: false,
        authors: authors,
        filteredAuthors: authors
      });
    } catch (error) {
      console.error("SOMETHING WENT WRONG");
      console.error(error);
      this.setState({ error: error });
    }
  }

  selectAuthor = async author => {
    try {
      const response = await axios.get(
        `https://the-index-api.herokuapp.com/api/authors/${author.id}/`
      );
      const newAuthor = response.data;
      this.setState({
        loading: false,
        currentAuthor: newAuthor
      });
    } catch (error) {
      console.error("SOMETHING WENT WRONG");
      console.error(error);
      this.setState({ error: error });
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let authors = this.state.authors;
    let filteredAuthors = authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.authors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };

  render() {
    if (this.state.loading) return <Loading />;
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
