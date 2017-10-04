import React from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'
import { withRouter } from 'react-router-dom'

import Box from '../components/Box'

const Home = ({ auth }) =>
  auth === null ? (
    <div>User Must Login</div>
  ) : (
    <div>
      <Box />
    </div>
  )

const mapStateToProps = ({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
})

const enhance = compose(firebaseConnect(), connect(mapStateToProps), withRouter)

export default enhance(Home)
