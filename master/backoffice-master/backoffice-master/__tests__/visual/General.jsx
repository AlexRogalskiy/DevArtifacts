import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button/Button'

import CookieInfo from '../../src/CookieInfo'
import Confirm from '../../src/Confirm'

class General extends React.Component {
  constructor() {
    super()

    this.state = {
      dialogOpen: false,
    }

    this.handleOpenDialoge = this.handleOpenDialoge.bind(this)
  }

  handleOpenDialoge() {
    this.setState({
      dialogOpen: true,
    })
  }

  render() {
    return (
      <Fragment>
        <CookieInfo {...this.props}>
          <Typography variant="body1">
            This is the cookie info
          </Typography>
        </CookieInfo>

        <Typography variant="display1">
          Confirm
        </Typography>
        <Button onClick={this.handleOpenDialoge}>Open Dialog</Button>
        <Confirm
          isOpen={this.state.dialogOpen}
          description="Are you sure you want to delete the entry?"
          onConfirm={() => {}}
        />
      </Fragment>
    )
  }
}

export default General
