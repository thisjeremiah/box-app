import React from 'react'
import Slider from './Slider'

class SliderForm extends React.Component {
  constructor() {
    super()
    this.state = {
      what: 0,
      okay: 0,
      cool: 0
    }
  }

  handleChange = event => {
    console.log(event.target.value)
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    console.log(this.state)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Slider
          name="what"
          onChange={this.handleChange}
          value={this.state.what}
        />
        <Slider
          name="cool"
          onChange={this.handleChange}
          value={this.state.cool}
        />
        <Slider
          name="okay"
          onChange={this.handleChange}
          value={this.state.okay}
        />
        <button type="submit">SAVE</button>
      </form>
    )
  }
}

export default SliderForm
