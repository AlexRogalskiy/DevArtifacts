    var ProductSearch = React.createClass({
      getInitialState: function() {
        return {data: []};
      },
      componentDidMount: function() {
        $.ajax({
          url: '/products.json',
          dataType: 'json',
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

      getResults: function(query){
        $.ajax({
          url: '/products.json?q=' + query,
          dataType: 'json',
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

      render: function() {
        return (
          <div>
            <h1>Product Search</h1>
            {  }
            {  }
            <ProductSearchForm onSearchRequest={this.getResults} />
            {  }
            <ProductList data={this.state.data} />
            {  }
          </div>
        );
      }
    });


    var ProductList = React.createClass({
      render: function() {
        var products = this.props.data.map(function (product) {
          return (
            <tr>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
            </tr>
          );
        });
        return (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Description</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products}
            </tbody>
          </table>
        );
      }
    });

    var ProductSearchForm = React.createClass({
      sendSearchQuery: function(e){
        e.preventDefault();
        var query = this.refs.query.getDOMNode().value.trim();

        this.props.onSearchRequest(query);

      },

      render: function(){
        return (
          <form onSubmit={this.sendSearchQuery}>
            <label forInput="query">Keywords</label>
            <input id="query" type="search" ref="query" />
            <input type="submit" value="search" />
          </form>
        );
      }
    });
    React.render(<ProductSearch />, document.getElementById('content'));
