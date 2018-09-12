import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import keycode from 'keycode'
import Uuid from 'init-uuid'
import Store from 'vanilla-store'

import ListingBranch from './ListingBranch'

/* eslint-disable */
Math.easeInOutQuad = (t, b, c, d) => {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
};
/* eslint-enable */

const withListing = Component => class Listing extends React.Component {
  static tryToMatch(value, content) {
    let initialContent = content

    if (!content) {
      return false
    }

    if (content.highlight) {
      initialContent = content.value
    }

    const contentToSearch = Listing.getStringContent(initialContent)

    if (contentToSearch.indexOf(value) > -1) {
      return true
    }

    return false
  }

  static filterElement(element, value, searchables) {
    const searchValue = value.toLowerCase()
    let newElement

    Object.keys(element).forEach((key) => {
      if (searchables.indexOf(key) > -1) {
        const matched = Listing.tryToMatch(searchValue, element[key])

        if (matched) {
          newElement = element
        }
      }
    })

    if (newElement) {
      Object.keys(newElement).forEach((key) => {
        if (newElement[key]) {
          newElement[key] = {
            highlight: searchValue,
            value: newElement[key].highlight ? newElement[key].value : newElement[key],
          }
        }
      })
    }

    return newElement
  }

  static propTypes = {
    orderBy: PropTypes.string.isRequired,
    hasLoader: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    headers: PropTypes.arrayOf(PropTypes.object).isRequired,
    toolbarContent: PropTypes.node,
    onUpdateSelection: PropTypes.func,
    id: PropTypes.string,
  }

  static defaultProps = {
    id: new Uuid().get(),
    hasLoader: false,
    toolbarContent: (<Fragment />),
    onUpdateSelection: () => { },
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      order: 'asc',
      orderBy: this.props.orderBy,
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      searchable: [],
      origData: null,
      id: null,
    }

    this.node = React.createRef()

    this.handleRequestSort = this.handleRequestSort.bind(this)
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleCheckClick = this.handleCheckClick.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.isSelected = this.isSelected.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
  }

  componentWillMount() {
    const storedData = Store.get('Listing', this.props.id)
    const newState = {
      data: this.sortData(this.props.data),
      searchable: Listing.getSearchableHeaders(this.props.headers),
    }

    if (storedData) {
      if (storedData.page) {
        newState.page = storedData.page
      }

      if (storedData.rowsPerPage) {
        newState.rowsPerPage = storedData.rowsPerPage
      }
    }

    this.setState(newState)
  }

  componentWillReceiveProps(nextProps) {
    const data = this.sortData(nextProps.data)

    this.setState({
      data,
      orderBy: nextProps.orderBy,
      searchable: Listing.getSearchableHeaders(nextProps.headers),
    })
  }

  static getSearchableHeaders(headers) {
    return headers
      .filter(header => header.isSearchable)
      .map(header => header.id)
  }

  static getStringContent(content) {
    let matchContent = content

    if (content.constructor === Array) {
      matchContent = content.join(' ')
    } else if (typeof content === 'object') {
      matchContent = Object.values(content).join(' ')
    }

    return matchContent.toLowerCase()
  }

  sortData(data) {
    const { orderBy } = this.state
    const { headers } = this.props
    const orderByHeader = headers.filter(header => header.id === orderBy)[0]
    let { transformData } = orderByHeader

    if (!data) {
      return data
    }

    if (typeof transformData !== 'function') {
      transformData = values => values
    }

    const transformedData = data.map((element) => {
      const newElement = element
      newElement[orderBy] = transformData(element[orderBy])

      return newElement
    })

    return transformedData.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))
  }

  handleRequestSort(event, property) {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))

    this.setState({
      data,
      order,
      orderBy,
    })
  }

  handleSelectAllClick(event, checked) {
    if (checked) {
      this.setState({
        selected: this.state.data.map(n => n.id),
      })

      return
    }

    this.setState({
      selected: [],
    })
  }

  handleKeyDown(event, id) {
    if (keycode(event) === 'space') {
      this.handleCheckClick(event, id)
    }
  }

  handleCheckClick(id) {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    this.props.onUpdateSelection(newSelected)

    this.setState({
      selected: newSelected,
    })
  }

  scrollToElement() {
    if (!this.node.current) {
      return
    }

    const { offsetTop } = this.node.current
    const start = window.scrollY
    const change = offsetTop - start
    const increment = 20
    const duration = 250
    let currentTime = 0

    const animateScroll = () => {
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, duration)
      window.scrollTo(0, val)

      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }
    }

    animateScroll()
  }

  handleChangePage(event, page) {
    Store.create('Listing', {
      id: this.props.id,
      rowsPerPage: this.state.rowsPerPage,
      page,
    })

    this.scrollToElement()

    this.setState({
      page,
    })
  }

  handleChangeRowsPerPage(event) {
    const rowsPerPage = event.target.value
    Store.create('Listing', {
      id: this.state.id,
      page: this.state.page,
      rowsPerPage,
    })

    this.setState({
      rowsPerPage,
    })
  }

  handleFilter(value) {
    const { searchable, origData, data } = this.state
    let searchableData

    if (origData && origData.constructor === Array) {
      searchableData = [...origData]
    } else {
      searchableData = [...data]
    }

    if (!value) {
      searchableData = searchableData.map((item) => {
        const newItem = item

        Object.keys(item).forEach((key) => {
          if (item[key]) {
            if (item[key].value) {
              newItem[key] = item[key].value
            } else {
              newItem[key] = item[key]
            }
          }
        })

        return newItem
      })

      this.setState({
        data: searchableData,
      })

      return
    }

    const newData = searchableData
      .map(element => (
        Listing.filterElement(element, value, searchable)
      ))
      .filter(item => item !== undefined)

    this.setState({
      data: newData,
      origData: searchableData,
    })
  }

  isSelected(id) {
    return this.state.selected.indexOf(id) !== -1
  }

  render() {
    return (
      <div ref={this.node}>
        <Component
          {...this.props}
          {...this.state}
          handleRequestSort={this.handleRequestSort}
          handleSelectAllClick={this.handleSelectAllClick}
          handleKeyDown={this.handleKeyDown}
          handleCheckClick={this.handleCheckClick}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
          handleChangePage={this.handleChangePage}
          onFilter={this.handleFilter}
          isSelected={this.isSelected}
        />
      </div>
    )
  }
}

export default withListing(ListingBranch)
