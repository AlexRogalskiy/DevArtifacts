import Component, { tracked } from "@glimmer/component";

export default class GlimmerjsSortableTable extends Component {

  @tracked activeRow;
  arry = [
    { id: 1, firstName: "Bram", lastName: "Moolenaar", knownFor: "Vim" },
    { id: 2, firstName: "Richard", lastName: "Stallman", knownFor: "GNU" },
    { id: 3, firstName: "Dennis", lastName: "Ritchie", knownFor: "C" },
    { id: 4, firstName: "Rich", lastName: "Hickey", knownFor: "Clojure" },
    { id: 5, firstName: "Guido", lastName: "Van Rossum", knownFor: "Python" },
    { id: 6, firstName: "Linus", lastName: "Torvalds", knownFor: "Linux" },
    { id: 7, firstName: "Yehuda", lastName: "Katz", knownFor: "Ember" }
  ];

  @tracked newArry;
  @tracked selectedTh: string = null;
  @tracked sortType: boolean = false;

  setRowActive(row) {
    this.activeRow = row;
  }

  sortColumn(par) {
    let sorty = this.sortType;
    let arry = this.arry;
    this.newArry = this.arry.sort(function(a, b) {

      if (typeof arry[0][par] === 'number') {
        return sorty ? (a[par] - b[par]) : (b[par] - a[par]);
      } else {
        var nameA = a[par].toUpperCase(); // ignore upper and lowercase
        var nameB = b[par].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return sorty ? -1 : 1;
        }
        if (nameA > nameB) {
          return sorty ? 1 : -1;
        }

        // names must be equal
        return 0;
      }

    });

    this.sortType = !this.sortType;

    // this.activeRow = null;

    this.selectedTh = par;
  }
  constructor(opts) {
    super(opts);
    this.newArry = this.arry;
  }

}
