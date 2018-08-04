var names = [
  "Gentry",
  "Brandi",
  "Maryann",
  "Tina",
  "Harper",
  "Hayes",
  "Tamera",
  "Shauna",
  "Mcfarland",
  "Charles",
  "Ortiz",
  "Maynard",
  "Julie",
  "Gay",
  "Wiggins",
  "Navarro",
  "Hopkins",
  "Candace",
  "Tammi",
  "Horton",
  "Erna",
  "Mills",
  "Opal",
  "Wolfe",
  "Walter",
  "Bonita",
  "Eleanor",
  "Rojas",
  "Ochoa",
  "Kirk",
  "Rosario",
  "Ball",
  "Lucile",
  "Kayla",
  "Carmela",
  "Miranda",
  "Middleton",
  "Lillie",
  "Sherry",
  "Jacqueline",
  "Deirdre",
  "Mueller",
  "Debra",
  "Jodi",
  "Joyce",
  "Estrada",
  "Liz",
  "Justine",
  "Francis",
  "Benton",
  "Henrietta",
  "Elise",
  "Lang",
  "Morse",
  "Farrell",
  "Tamra",
  "Darla",
  "Amy",
  "Kristie",
  "Wyatt",
  "Mcbride",
  "Talley",
  "Fay",
  "Sweet",
  "Fern",
  "Mcintosh",
  "Clemons",
  "Travis",
  "Kirsten",
  "Rios",
  "Newman",
  "Cook",
  "Jocelyn",
  "Mcmillan",
  "Mona",
  "Bessie",
  "Francis",
  "Rosemary",
  "Beverly",
  "Chandra",
  "Luella",
  "Parrish",
  "Ronda",
  "Earlene",
  "Bright",
  "Guthrie",
  "Shana",
  "Theresa",
  "Wells",
  "Green",
  "Schroeder",
  "Russo",
  "Randolph",
  "Livingston",
  "Carroll",
  "Velasquez",
  "Dana",
  "Bridget",
  "Hines",
  "Martha",
  "Marci",
  "Fuentes",
  "Stuart",
  "Glass",
  "Alejandra",
  "Thornton",
  "Britt",
  "Jeri",
  "Leach",
  "Cleo",
  "Lela",
  "Mattie",
  "Bonnie",
  "Lucille",
  "Mamie",
  "Kelly",
  "Obrien",
  "Carol",
  "Murphy",
  "Isabella",
  "Lowery",
  "Odom",
  "Norris",
  "Mullins",
  "Florine",
  "Morales",
  "Frederick",
  "Reynolds",
  "Janine",
  "Joyce",
  "Dean",
  "Marcy",
  "Allison",
  "Rena",
  "Saundra",
  "Flossie",
  "Kristi",
  "Monica",
  "Molina",
  "Guzman",
  "Loretta",
  "Levine",
  "Oneill",
  "Mccray",
  "Mann",
  "Constance",
  "English",
  "Eula",
  "Butler",
  "Erika"
];

var CleanSearchResult = React.createClass({
  render: function() {
    if(this.props.results.length == 0){
      return <div></div>;
    }
    
    var createItem = function(result) {
      return (<div className="result-box">
        {result.text}
      </div>);
    };
    return <div className="clean-search-result">{this.props.results.map(createItem)}</div>;
  }
});

var CleanSearch = React.createClass({
  getInitialState: function() {
    return {results: [], text: ''};
  },
  
  onChange: function(e) {
    // Don't give any result if string is empty
    if(!e.target.value){
      this.setState(this.getInitialState());
      return;
    }
    
    this.setState({
      text: e.target.value,
      results: this.props.searchFunction(e.target.value)
    });
  },
  
  render: function() {
    return (
      <div className="clean-search-container">
        <input placeholder="Search..." autoComplete="off" className="clean-search-input" onChange={this.onChange} value={this.state.text}/>
        <CleanSearchResult results={this.state.results}/>
      </div>
    );
  }
});

var search = function(name){
  console.log(names);
  return(
    names
    .filter(function(n){
      return n.search(new RegExp(name, "i")) !== -1;
    })
    .slice(0,10)
    .map(function(n){
      return {text: n};
    })
  );
}

React.render(<CleanSearch searchFunction={search} />, document.getElementById('search'));